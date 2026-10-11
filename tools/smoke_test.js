/* Browser smoke test: opens every page (file:// and http://), fails on any JS error,
   and exercises the quiz, payoff, ticket, journal, scorecard and rulebook tools.
   Usage: node tools/smoke_test.js   (needs the `playwright` package; set NODE_PATH if installed globally) */
const { chromium } = require("playwright");
const path = require("path");
const http = require("http");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");
const PAGES = ["index.html", "placement.html", "ticket.html", "payoff.html", "journal.html", "scorecard.html", "rulebook.html", "sources.html"];
const MODULE_IDS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
let failures = 0;
function check(cond, msg) { if (!cond) { failures++; console.log("  FAIL:", msg); } else console.log("  ok:", msg); }

function serve() {
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".md": "text/markdown", ".csv": "text/csv" };
  const srv = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": types[path.extname(p)] || "application/octet-stream" });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise((r) => srv.listen(0, "127.0.0.1", () => r(srv)));
}

async function openPage(ctx, url) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url);
  await page.waitForLoadState("load");
  return { page, errors };
}

(async () => {
  const browser = await chromium.launch();
  const srv = await serve();
  const bases = { file: "file://" + ROOT + "/", http: "http://127.0.0.1:" + srv.address().port + "/" };

  for (const [kind, base] of Object.entries(bases)) {
    console.log("\n== " + kind + " ==");
    const ctx = await browser.newContext({ acceptDownloads: true });
    for (const p of PAGES) {
      const { page, errors } = await openPage(ctx, base + p);
      const disc = await page.locator(".disclaimer").first().textContent();
      check(errors.length === 0, `${p}: no JS errors ${errors.join(" | ")}`);
      check(/not personalized financial advice/i.test(disc), `${p}: disclaimer present`);
      check(await page.locator(".site-header").count() === 1, `${p}: nav rendered`);
      await page.close();
    }
    for (const id of MODULE_IDS) {
      const { page, errors } = await openPage(ctx, base + "module.html?m=" + id);
      await page.waitForSelector(".quiz", { timeout: 5000 }).catch(() => {});
      const quizzes = await page.locator(".quiz").count();
      const qs = await page.locator(".quiz .q").count();
      const charts = await page.locator("svg.payoff").count();
      const disc = await page.locator("main").textContent();
      check(errors.length === 0, `module ${id}: no JS errors ${errors.join(" | ")}`);
      check(quizzes === 1 && qs >= 3 && qs <= 5, `module ${id}: 1 quiz with ${qs} questions`);
      check(/not personalized financial advice/i.test(disc), `module ${id}: in-lesson disclaimer`);
      check(await page.locator("h2#what-would-break-this-trade").count() === 1, `module ${id}: 'what would break this trade' section`);
      if (["03", "10"].includes(id)) check(charts >= 3, `module ${id}: payoff diagrams (${charts})`);
      await page.close();
    }
    await ctx.close();
  }

  console.log("\n== interactions (file://) ==");
  const ctx = await browser.newContext({ acceptDownloads: true });
  const base = bases.file;

  // Module quiz grading + localStorage
  let { page, errors } = await openPage(ctx, base + "module.html?m=07");
  await page.waitForSelector(".quiz");
  const n = await page.locator(".quiz .q").count();
  for (let i = 0; i < n; i++) await page.locator(`.quiz .q[data-q="${i}"] input`).first().check();
  await page.click(".quiz .grade");
  const scoreText = await page.locator(".quiz .score").textContent();
  check(/Score: \d\/\d/.test(scoreText), "module quiz grades: " + scoreText.trim());
  const stored = await page.evaluate(() => localStorage.getItem("sosnoff.quiz.module-07"));
  check(!!stored, "module quiz score saved to localStorage");
  check(errors.length === 0, "module quiz: no errors");
  await page.close();

  // Placement quiz: 15 questions, answer all correctly
  ({ page, errors } = await openPage(ctx, base + "placement.html"));
  check(await page.locator(".quiz .q").count() === 15, "placement quiz has 15 questions");
  for (let i = 0; i < 15; i++) await page.locator(`.quiz .q[data-q="${i}"] input`).nth(i === 0 ? 2 : 1).check();
  await page.click(".quiz .grade");
  const rec = await page.locator("#result").textContent();
  check(/Score:/.test(rec), "placement result shown");
  ({ page } = await openPage(ctx, base + "index.html"));
  check(/Suggested starting point/.test(await page.locator("#next-step").textContent()), "index shows placement recommendation");
  check(/best \d\/\d/.test(await page.locator("#module-table").textContent()), "index shows module quiz progress");
  await page.close();

  // Payoff tool: every structure renders
  ({ page, errors } = await openPage(ctx, base + "payoff.html"));
  const opts = await page.locator("#structure option").evaluateAll((os) => os.map((o) => o.value));
  check(opts.length === 10, "payoff tool lists 10 structures");
  for (const o of opts) {
    await page.selectOption("#structure", o);
    const txt = await page.locator("#out").textContent();
    check(await page.locator("#out svg.payoff").count() === 1 && /Max loss/.test(txt), "payoff renders " + o);
  }
  await page.selectOption("#structure", "short-strangle");
  check(/Unlimited/.test(await page.locator("#out").textContent()), "strangle shows unlimited loss");
  await page.selectOption("#structure", "iron-condor");
  const icTxt = await page.locator("#out").textContent();
  check(/\$60/.test(icTxt) && /46\.6 \/ 53\.4/.test(icTxt), "iron condor max loss $60, BEs 46.6/53.4");
  check(errors.length === 0, "payoff tool: no errors " + errors.join(" | "));
  await page.close();

  // Trade ticket
  ({ page, errors } = await openPage(ctx, base + "ticket.html"));
  await page.fill("#entry", "2026-10-12");
  await page.fill("#expiration", "2026-11-27");
  await page.click("#example");
  let res = await page.locator("#results").textContent();
  check(/\$22\.00/.test(res) && /\$78\.00/.test(res), "ticket: max profit $22 / max loss $78");
  check(/209\.78/.test(res), "ticket: breakeven 209.78");
  check(/78\.0%/.test(res) && /87\.6%/.test(res), "ticket: BE win rates 78.0% (hold) and 87.6% (50% target)");
  check(/\$0\.11/.test(res), "ticket: GTC price $0.11");
  check(/Nov 6, 2026/.test(res), "ticket: 21-DTE date = Fri Nov 6, 2026");
  check(/Passes your rulebook/.test(res), "ticket: passes rulebook");
  // over-limit and earnings warnings
  await page.fill('#strikes [data-k="longPut"]', "208");
  res = await page.locator("#results").textContent();
  check(/exceeds your \$100 per-trade limit/.test(res), "ticket: warns when max loss > $100");
  await page.fill('#strikes [data-k="longPut"]', "209");
  await page.fill("#earnings", "2026-11-03");
  res = await page.locator("#results").textContent();
  check(/EARNINGS RULE/.test(res), "ticket: warns when earnings before 21-DTE date");
  await page.fill("#earnings", "");
  await page.fill("#open-count", "3");
  res = await page.locator("#results").textContent();
  check(/would make 4 open positions/.test(res), "ticket: warns when open positions would exceed 3");
  await page.fill("#open-count", "0");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#ics")]);
  const ics = fs.readFileSync(await dl.path(), "utf8");
  check(/BEGIN:VCALENDAR/.test(ics) && /DTSTART;TZID=America\/Chicago:20261106T083000/.test(ics), "ticket: .ics has 21-DTE event at 8:30 CT on 2026-11-06");
  check(ics.split("\r\n").every((l) => l.length <= 75), "ticket: .ics lines folded");
  await page.click("#save-open");
  check(/IWM/.test(await page.locator("#open-list").textContent()), "ticket: open position saved");
  check(errors.length === 0, "ticket: no errors " + errors.join(" | "));
  await page.close();

  // Journal: add two losing trades, export CSV
  ({ page, errors } = await openPage(ctx, base + "journal.html"));
  const today = new Date(); const ymd = (d) => d.toISOString().slice(0, 10);
  for (const [pnl, reason] of [["11", "50% target"], ["-30", "21 DTE"], ["-45", "21 DTE"]]) {
    await page.fill('[name="date"]', "2026-09-01");
    await page.fill('[name="underlying"]', "spy");
    await page.fill('[name="structure"]', "Short put vertical");
    await page.fill('[name="credit"]', "22");
    await page.fill('[name="max_loss"]', "78");
    await page.fill('[name="exit_date"]', ymd(today));
    await page.selectOption('[name="exit_reason"]', reason);
    await page.fill('[name="pnl"]', pnl);
    await page.selectOption('[name="rule_followed"]', "Y");
    await page.selectOption('[name="mode"]', "live");
    await page.click("#save");
  }
  check(await page.locator("#rows tr").count() === 3, "journal: 3 rows logged");
  const [dl2] = await Promise.all([page.waitForEvent("download"), page.click("#export")]);
  const csv = fs.readFileSync(await dl2.path(), "utf8");
  check(csv.startsWith("date,track,underlying,structure,dte,iv_rank,credit,max_loss,exit_reason,pnl,rule_followed,notes") && csv.trim().split("\n").length === 4, "journal: CSV export with header + 3 rows");
  check(errors.length === 0, "journal: no errors " + errors.join(" | "));
  await page.close();

  // Scorecard
  ({ page, errors } = await openPage(ctx, base + "scorecard.html"));
  const sc = await page.locator("main").textContent();
  check(/LOCKOUT active/.test(sc), "scorecard: lockout after 2 consecutive losses");
  check(/Live P&L to date: −\$64\.00/.test(sc), "scorecard: live P&L −$64");
  check(/Closed trades\s*3/.test(sc), "scorecard: counts 3 closed trades");
  check(errors.length === 0, "scorecard: no errors " + errors.join(" | "));
  await page.close();

  // Ticket now shows lockout
  ({ page } = await openPage(ctx, base + "ticket.html"));
  await page.click("#example");
  check(/LOCKOUT/.test(await page.locator("#results").textContent()), "ticket: reflects journal lockout");
  await page.close();

  // Journal CSV import (template has a later-dated winning row, which ends the lockout)
  ({ page, errors } = await openPage(ctx, base + "journal.html"));
  await page.setInputFiles("#import", path.join(ROOT, "templates/journal-template.csv"));
  await page.waitForTimeout(200);
  check(await page.locator("#rows tr").count() === 4, "journal: CSV template imports");
  check(errors.length === 0, "journal import: no errors " + errors.join(" | "));
  await page.close();

  // Rulebook: change limit, flows to ticket
  ({ page, errors } = await openPage(ctx, base + "rulebook.html"));
  await page.fill('[name="maxRiskPerTrade"]', "80");
  check(/Max loss ≤ \$80/.test(await page.locator("#rulebook").textContent()), "rulebook: edits update the rulebook");
  const [dl3] = await Promise.all([page.waitForEvent("download"), page.click("#dl")]);
  check(/RULEBOOK|Rulebook/.test(fs.readFileSync(await dl3.path(), "utf8")), "rulebook: text download");
  check(errors.length === 0, "rulebook: no errors " + errors.join(" | "));
  await page.close();
  ({ page } = await openPage(ctx, base + "payoff.html?s=short-put-vertical"));
  check(/\$80 per-trade limit/.test(await page.locator("#out").textContent()), "payoff tool uses rulebook limit");
  await page.close();

  // Mobile width: no horizontal scroll on the course page
  const mctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
  for (const p of ["index.html", "module.html?m=05", "ticket.html"]) {
    const mp = await mctx.newPage();
    await mp.goto(base + p);
    await mp.waitForTimeout(150);
    const over = await mp.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(over <= 1, `mobile ${p}: no horizontal page scroll (${over}px)`);
    await mp.screenshot({ path: path.join(process.env.SHOT_DIR || "/tmp", "mobile-" + p.replace(/[^\w]/g, "_") + ".png") });
    await mp.close();
  }

  await browser.close();
  srv.close();
  console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL CHECKS PASSED");
  process.exit(failures ? 1 : 0);
})();
