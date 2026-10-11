/* Trade ticket: calculates the numbers for a defined-risk credit spread, checks the rulebook,
   tracks open positions, and builds an .ics reminder for the 21-DTE close. */
(function () {
  "use strict";
  var C = window.Course, P = window.Payoff;
  var S = C.getSettings();

  var STRUCTS = {
    "short-put-vertical": { label: "Short put vertical", legs: 2 },
    "short-call-vertical": { label: "Short call vertical", legs: 2 },
    "iron-condor": { label: "Iron condor", legs: 4 }
  };

  var $ = function (id) { return document.getElementById(id); };
  var strikeBox = $("strikes");

  function openPositions() { return C.load(C.KEYS.open, []); }
  function saveOpen(list) { C.save(C.KEYS.open, list); }

  function buildStrikeInputs() {
    var key = $("structure").value;
    var st = P.STRUCTURES[key];
    strikeBox.innerHTML = "";
    st.fields.forEach(function (f) {
      var lab = document.createElement("label");
      lab.innerHTML = C.esc(f[1]) + '<input type="number" step="any" min="0" data-k="' + f[0] + '" required>';
      strikeBox.appendChild(lab);
    });
    strikeBox.querySelectorAll("input").forEach(function (i) { i.addEventListener("input", calc); });
  }

  function trading21(exp) {
    var d = C.addDays(exp, -(+S.closeAtDTE || 21));
    var shifted = false;
    while (d.getDay() === 0 || d.getDay() === 6) { d = C.addDays(d, -1); shifted = true; }
    return { date: d, shifted: shifted };
  }

  function lockoutStatus() {
    var j = C.load(C.KEYS.journal, []).filter(function (r) { return r.exit_date && r.pnl !== "" && !isNaN(parseFloat(r.pnl)); });
    j.sort(function (a, b) { return a.exit_date < b.exit_date ? -1 : a.exit_date > b.exit_date ? 1 : 0; });
    var n = +S.lockoutLosses || 2;
    var lastN = j.slice(-n);
    var res = { locked: false, until: null, livePnl: 0 };
    j.forEach(function (r) { if ((r.mode || "paper") === "live") res.livePnl += parseFloat(r.pnl); });
    if (lastN.length === n && lastN.every(function (r) { return parseFloat(r.pnl) < 0; })) {
      var last = C.parseDate(lastN[n - 1].exit_date);
      var until = C.addDays(last, Math.ceil((+S.lockoutHours || 24) / 24));
      if (C.today() < until) { res.locked = true; res.until = until; }
    }
    return res;
  }

  function read() {
    var p = { premium: parseFloat($("credit").value), qty: parseInt($("qty").value, 10) || 1 };
    var ok = !isNaN(p.premium);
    strikeBox.querySelectorAll("input").forEach(function (i) {
      var v = parseFloat(i.value);
      if (isNaN(v)) ok = false;
      p[i.getAttribute("data-k")] = v;
    });
    p.spot = parseFloat($("spot").value);
    return ok ? p : null;
  }

  function validateStrikes(key, p) {
    if (key === "short-put-vertical" && !(p.longPut < p.shortPut)) return "Long put strike must be below the short put strike.";
    if (key === "short-call-vertical" && !(p.shortCall < p.longCall)) return "Long call strike must be above the short call strike.";
    if (key === "iron-condor" && !(p.longPut < p.shortPut && p.shortPut < p.shortCall && p.shortCall < p.longCall))
      return "Iron condor strikes must be in order: long put < short put < short call < long call.";
    return null;
  }

  var last = null;

  function calc() {
    var out = $("results");
    var key = $("structure").value;
    var p = read();
    var entry = C.parseDate($("entry").value);
    var exp = C.parseDate($("expiration").value);
    if (!p || !entry || !exp) {
      out.innerHTML = '<p class="muted">Enter strikes, credit, entry date and expiration to see results.</p>';
      $("ics").disabled = true; $("save-open").disabled = true; last = null;
      return;
    }
    var strikeErr = validateStrikes(key, p);
    if (!(p.spot > 0)) p.spot = key === "short-call-vertical" ? p.shortCall - 1 : key === "short-put-vertical" ? p.shortPut + 1 : (p.shortPut + p.shortCall) / 2;
    var res = P.analyze(key, p);
    var maxProfit = res.maxProfit, maxLoss = Math.abs(Math.min(0, res.maxLoss));
    var feePer = parseFloat($("fee").value); if (isNaN(feePer)) feePer = 0.65;
    var legs = STRUCTS[key].legs;
    var feesOpen = legs * feePer * p.qty, feesRound = feesOpen * 2;
    var tgtPct = (+S.profitTargetPct || 50) / 100;
    var gtc = p.premium * (1 - tgtPct);
    var gtcNickel = Math.floor(gtc / 0.05 + 1e-9) * 0.05;
    var dte = C.daysBetween(entry, exp);
    var t21 = trading21(exp);
    var daysTo21 = C.daysBetween(entry, t21.date);
    var beHold = C.breakevenWinRate(maxProfit, maxLoss);
    var beTarget = C.breakevenWinRate(maxProfit * tgtPct, maxLoss);
    var beTargetFees = C.breakevenWinRate(maxProfit * tgtPct - feesRound, maxLoss + feesRound);

    var nOpen = parseInt($("open-count").value, 10) || 0;
    var openRisk = parseFloat($("open-risk").value) || 0;
    var earn = C.parseDate($("earnings").value);
    var ivr = parseFloat($("ivr").value);
    var lock = lockoutStatus();

    var alerts = [];
    function bad(t) { alerts.push(["bad", t]); }
    function warn(t) { alerts.push(["warn", t]); }
    function info(t) { alerts.push(["good", t]); }
    if (strikeErr) bad(strikeErr);
    var width = maxLoss / 100 / p.qty + p.premium;
    if (p.premium <= 0) bad("Credit must be greater than zero.");
    if (!strikeErr && maxLoss <= 0) bad("Credit is at or above the spread width — check your numbers.");
    if (maxLoss > S.maxRiskPerTrade) bad("Max loss " + C.money(maxLoss, 0) + " exceeds your " + C.money(S.maxRiskPerTrade, 0) + " per-trade limit.");
    if (p.qty > S.maxContracts) bad("Contracts (" + p.qty + ") exceed your limit of " + S.maxContracts + ".");
    if (nOpen + 1 > S.maxOpenPositions) bad("This would make " + (nOpen + 1) + " open positions — your maximum is " + S.maxOpenPositions + ".");
    if (openRisk + maxLoss > S.maxTotalOpenRisk) bad("Total open risk would be " + C.money(openRisk + maxLoss, 0) + " — your limit is " + C.money(S.maxTotalOpenRisk, 0) + ".");
    if (earn) {
      if (earn >= entry && earn <= t21.date) bad("EARNINGS RULE: earnings (" + C.prettyDate(earn) + ") fall on or before your 21-DTE close date (" + C.prettyDate(t21.date) + "). Skip this trade.");
      else if (earn > t21.date && earn <= exp) warn("Earnings (" + C.prettyDate(earn) + ") fall after your 21-DTE date but before expiration. You must close on the 21-DTE date — no exceptions.");
    } else {
      warn("No earnings date entered. For single stocks, check the date before entry (ETFs/XSP have none).");
    }
    if (daysTo21 <= 0) bad("Entry is already inside 21 DTE — the routine would close it immediately.");
    if (dte < 35 || dte > 55) warn(dte + " DTE is outside the ~45 DTE target (35–55 acceptable).");
    if (exp.getDay() === 0 || exp.getDay() === 6) warn("Expiration falls on a weekend — check the date.");
    if (t21.shifted) info("The 21-DTE date fell on a weekend, so it was moved to the prior Friday. Market holidays are not checked.");
    if (!isNaN(ivr) && ivr < S.minIVRank) warn("IV rank " + ivr + " is below your minimum of " + S.minIVRank + ".");
    if (lock.locked) bad("LOCKOUT: your last " + S.lockoutLosses + " journal trades were losses. No new trades until " + C.prettyDate(lock.until) + ".");
    if (lock.livePnl <= -S.stopLossTotal) bad("STOP: live P&L in your journal is " + C.money(lock.livePnl) + ". Your rule is to stop live trading at −" + C.money(S.stopLossTotal, 0) + " and return to paperMoney.");
    if (/pending/i.test(S.approvalLevel)) info("Approval is pending — place this in paperMoney.");
    if (maxProfit * tgtPct <= feesRound) warn("At the " + Math.round(tgtPct * 100) + "% target, the win (" + C.money(maxProfit * tgtPct) + ") does not cover round-trip fees (" + C.money(feesRound) + ").");
    var blocking = alerts.some(function (a) { return a[0] === "bad"; });

    var underlying = $("underlying").value.trim().toUpperCase() || "—";
    var strikesTxt = res.strikes.join("/");
    last = {
      underlying: underlying, structure: STRUCTS[key].label, key: key, strikes: strikesTxt, credit: p.premium, qty: p.qty,
      maxLoss: maxLoss, maxProfit: maxProfit, entry: C.fmtDate(entry), expiration: C.fmtDate(exp), close21: C.fmtDate(t21.date),
      gtc: gtc, dte: dte, ivr: isNaN(ivr) ? "" : ivr
    };

    out.innerHTML =
      (alerts.length ? alerts.map(function (a) { return '<div class="alert ' + a[0] + '">' + C.esc(a[1]) + "</div>"; }).join("") : "") +
      '<div class="alert ' + (blocking ? "bad" : "good") + '"><strong>' + (blocking ? "Does not pass your rulebook." : "Passes your rulebook checks.") + "</strong></div>" +
      '<div class="kv">' +
      "<div><span>Max profit</span><b>" + C.money(maxProfit) + "</b></div>" +
      "<div><span>Max loss</span><b>" + C.money(maxLoss) + "</b></div>" +
      "<div><span>Breakeven(s) at expiration</span><b>" + (res.breakevens.join(" / ") || "—") + "</b></div>" +
      "<div><span>Spread width</span><b>" + C.money(width) + "</b></div>" +
      "<div><span>Breakeven win rate (hold to expiration)</span><b>" + C.pct(beHold) + "</b></div>" +
      "<div><span>Breakeven win rate (" + Math.round(tgtPct * 100) + "% target, losers at max)</span><b>" + C.pct(beTarget) + "</b></div>" +
      "<div><span>…same, including est. fees</span><b>" + C.pct(beTargetFees) + "</b></div>" +
      "<div><span>GTC buy-to-close (" + Math.round(tgtPct * 100) + "% profit)</span><b>" + C.money(gtc) + "</b></div>" +
      "<div><span>…if strikes trade in $0.05 increments</span><b>" + C.money(gtcNickel) + "</b></div>" +
      "<div><span>DTE at entry</span><b>" + dte + "</b></div>" +
      "<div><span>21-DTE close date</span><b>" + C.prettyDate(t21.date) + "</b></div>" +
      "<div><span>Est. fees (open / round trip)</span><b>" + C.money(feesOpen) + " / " + C.money(feesRound) + "</b></div>" +
      "</div>" +
      '<p class="small muted">Breakeven win rate = max loss ÷ (average win + max loss). "Losers at max" is the conservative case; closing at 21 DTE usually makes losers smaller (Module 07). The 21-DTE date is expiration minus 21 calendar days.</p>' +
      P.svgChart(res, p.spot);

    $("ics").disabled = !!strikeErr;
    $("save-open").disabled = !!strikeErr;
    $("save-open").textContent = blocking ? "Save as open position (rule override)" : "Save as open position";
  }

  /* --- .ics calendar file --- */
  function icsEscape(s) { return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); }
  function fold(line) {
    var out = [];
    while (line.length > 74) { out.push(line.slice(0, 74)); line = " " + line.slice(74); }
    out.push(line);
    return out.join("\r\n");
  }
  function ymd(d) { return C.fmtDate(d).replace(/-/g, ""); }
  function buildICS(t) {
    var d = C.parseDate(t.close21);
    var stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
    var summary = "CLOSE at " + (+S.closeAtDTE || 21) + " DTE: " + t.underlying + " " + t.strikes + " " + t.structure;
    var desc = "Rulebook: close this position today regardless of P&L unless the 50% GTC order already filled.\n" +
      "Underlying: " + t.underlying + "\nStructure: " + t.structure + " " + t.strikes + "\nContracts: " + t.qty +
      "\nCredit: " + C.money(t.credit) + " per share\nGTC buy-to-close: " + C.money(t.gtc) +
      "\nMax loss: " + C.money(t.maxLoss) + "\nEntered: " + t.entry + "\nExpiration: " + t.expiration +
      "\nAfter closing, log the trade in the journal.\nEducational only - not personalized financial advice.";
    var lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Premium Selling the Sosnoff Way//Trade Ticket//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VTIMEZONE", "TZID:America/Chicago",
      "BEGIN:DAYLIGHT", "TZOFFSETFROM:-0600", "TZOFFSETTO:-0500", "TZNAME:CDT", "DTSTART:19700308T020000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU", "END:DAYLIGHT",
      "BEGIN:STANDARD", "TZOFFSETFROM:-0500", "TZOFFSETTO:-0600", "TZNAME:CST", "DTSTART:19701101T020000", "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU", "END:STANDARD",
      "END:VTIMEZONE",
      "BEGIN:VEVENT",
      "UID:" + ymd(d) + "-" + Math.random().toString(36).slice(2, 10) + "@sosnoff-course.local",
      "DTSTAMP:" + stamp,
      "DTSTART;TZID=America/Chicago:" + ymd(d) + "T083000",
      "DTEND;TZID=America/Chicago:" + ymd(d) + "T090000",
      "SUMMARY:" + icsEscape(summary),
      "DESCRIPTION:" + icsEscape(desc),
      "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + icsEscape(summary), "TRIGGER:-PT0M", "END:VALARM",
      "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + icsEscape("Tomorrow: " + summary), "TRIGGER:-P1D", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ];
    return lines.map(fold).join("\r\n") + "\r\n";
  }

  function renderOpen() {
    var list = openPositions();
    var box = $("open-list");
    $("open-count").value = list.length;
    $("open-risk").value = list.reduce(function (a, r) { return a + (+r.maxLoss || 0); }, 0);
    if (!list.length) { box.innerHTML = '<p class="muted">No saved open positions.</p>'; return; }
    box.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Underlying</th><th>Structure</th><th class="num">Credit</th><th class="num">Max loss</th><th class="num">GTC</th><th>Close by (21 DTE)</th><th></th></tr></thead><tbody>' +
      list.map(function (r, i) {
        var due = C.parseDate(r.close21);
        var flag = due && C.today() >= due ? ' <span class="badge unverified">Close today</span>' : "";
        var pre = encodeURIComponent(JSON.stringify({ date: r.entry, track: "45DTE", underlying: r.underlying, structure: r.structure + " " + r.strikes, dte: r.dte, iv_rank: r.ivr, credit: (r.credit * 100 * r.qty).toFixed(2), max_loss: r.maxLoss.toFixed(2) }));
        return "<tr><td>" + C.esc(r.underlying) + "</td><td>" + C.esc(r.structure + " " + r.strikes) + '</td><td class="num">' + C.money(r.credit) +
          '</td><td class="num">' + C.money(r.maxLoss, 0) + '</td><td class="num">' + C.money(r.gtc) + "</td><td>" + C.prettyDate(due) + flag +
          '</td><td><a href="journal.html?prefill=' + pre + '">Log exit</a> · <button type="button" class="danger" data-rm="' + i + '">Remove</button></td></tr>';
      }).join("") + "</tbody></table></div>";
    box.querySelectorAll("[data-rm]").forEach(function (b) {
      b.addEventListener("click", function () {
        var l = openPositions(); l.splice(+b.getAttribute("data-rm"), 1); saveOpen(l); renderOpen(); calc();
      });
    });
  }

  function init() {
    Object.keys(STRUCTS).forEach(function (k) {
      var o = document.createElement("option"); o.value = k; o.textContent = STRUCTS[k].label; $("structure").appendChild(o);
    });
    $("entry").value = C.fmtDate(C.today());
    $("expiration").value = C.fmtDate(C.addDays(C.today(), +S.targetDTE || 45));
    $("qty").value = 1;
    $("limits").innerHTML = "Your limits (from the <a href=\"rulebook.html\">rulebook</a>): max loss " + C.money(S.maxRiskPerTrade, 0) +
      " · " + S.maxContracts + " contract(s) · max " + S.maxOpenPositions + " open · total open risk " + C.money(S.maxTotalOpenRisk, 0) +
      " · profit target " + S.profitTargetPct + "% · close at " + S.closeAtDTE + " DTE · min IV rank " + S.minIVRank + ".";
    buildStrikeInputs();
    renderOpen();
    $("structure").addEventListener("change", function () { buildStrikeInputs(); calc(); });
    document.querySelectorAll("#ticket input").forEach(function (i) { i.addEventListener("input", calc); });
    $("ics").addEventListener("click", function () {
      if (!last) return;
      C.download("close-21dte-" + last.underlying + "-" + last.close21 + ".ics", buildICS(last), "text/calendar");
    });
    $("save-open").addEventListener("click", function () {
      if (!last) return;
      var l = openPositions(); l.push(last); saveOpen(l); renderOpen(); calc();
    });
    $("example").addEventListener("click", function () {
      $("structure").value = "short-put-vertical"; buildStrikeInputs();
      $("underlying").value = "IWM"; $("spot").value = 220; $("credit").value = 0.22; $("ivr").value = 38;
      strikeBox.querySelector('[data-k="longPut"]').value = 209;
      strikeBox.querySelector('[data-k="shortPut"]').value = 210;
      $("earnings").value = "";
      calc();
    });
    calc();
  }

  window.TicketInternals = { buildICS: buildICS, trading21: trading21 };
  init();
})();
