/* Today: the once-a-morning routine. Reads the rulebook, saved open positions and the journal,
   says what (if anything) needs doing today, and keeps today's ticks (they reset each day). */
(function () {
  "use strict";
  var C = window.Course, S = C.getSettings();
  var KEY = "sosnoff.checklist";
  var $ = function (id) { return document.getElementById(id); };
  var today = C.today(), todayStr = C.fmtDate(today);

  var GROUPS = [
    { id: "glance", title: "Morning glance — every trading day", items: [
      ["g1", "Open thinkorswim (or paperMoney) once, between 8:30 and 10:00 AM CT."],
      ["g2", "For each open position: did the 50% GTC buy-to-close fill? If yes, log the exit in the journal and remove it from open positions."],
      ["g3", "Is any position at its 21-DTE date? If yes, close it today regardless of P&L."],
      ["g4", "Confirm every GTC order is still working (Order tab)."],
      ["g5", "Nothing else to do? Close the platform. No intraday watching. No price stops on defined-risk trades."]
    ] },
    { id: "entry", title: "Entry day — at most " + S.newTradesPerWeek + " new trade" + (S.newTradesPerWeek == 1 ? "" : "s") + " per week", items: [
      ["e1", "No lockout, live P&L above −" + C.money(S.stopLossTotal, 0) + ", and fewer than " + S.maxOpenPositions + " positions open."],
      ["e2", "Pick an underlying: SPY / QQQ / IWM / XSP, or a liquid single stock with $1-wide strikes. IV rank ≥ " + S.minIVRank + "."],
      ["e3", "Check the earnings date — skip if it falls on or before the " + S.closeAtDTE + "-DTE date."],
      ["e4", "Choose the expiration closest to " + S.targetDTE + " DTE. Run the trade ticket; it must pass."],
      ["e5", "Sell the spread near the mid. Max loss ≤ " + C.money(S.maxRiskPerTrade, 0) + ", " + S.maxContracts + " contract."],
      ["e6", "Immediately place the GTC buy-to-close at " + (100 - S.profitTargetPct) + "% of the credit."],
      ["e7", "Add the " + S.closeAtDTE + "-DTE reminder to your calendar, save the position in the ticket, and log the entry in the journal."]
    ] },
    { id: "close", title: S.closeAtDTE + "-DTE close day", items: [
      ["c1", "Cancel the GTC order and close the whole spread, win or lose."],
      ["c2", "Log the exit: reason “21 DTE”, P&L after fees, rule followed Y/N."],
      ["c3", "Remove the position from open positions in the trade ticket."]
    ] }
  ];

  function ticks() {
    var t = C.load(KEY, null);
    return t && t.date === todayStr ? t : { date: todayStr, done: {} };
  }

  function centralNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit", hour12: false, weekday: "short" }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      var h = +o.hour % 24, m = +o.minute;
      return { label: new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" }).format(new Date()), mins: h * 60 + m, weekday: o.weekday };
    } catch (e) { return null; }
  }

  function status() {
    var journal = C.load(C.KEYS.journal, []);
    var open = C.load(C.KEYS.open, []);
    var closed = journal.filter(function (r) { return r.exit_date && r.pnl !== "" && !isNaN(parseFloat(r.pnl)); })
      .sort(function (a, b) { return a.exit_date < b.exit_date ? -1 : a.exit_date > b.exit_date ? 1 : 0; });
    var n = +S.lockoutLosses || 2, lastN = closed.slice(-n), lockUntil = null;
    if (lastN.length === n && lastN.every(function (r) { return parseFloat(r.pnl) < 0; })) {
      var until = C.addDays(C.parseDate(lastN[n - 1].exit_date), Math.ceil((+S.lockoutHours || 24) / 24));
      if (today < until) lockUntil = until;
    }
    var live = closed.filter(function (r) { return r.mode === "live"; }).reduce(function (a, r) { return a + parseFloat(r.pnl); }, 0);
    var monday = C.addDays(today, -((today.getDay() + 6) % 7));
    var entriesThisWeek = {};
    open.forEach(function (r) { var d = C.parseDate(r.entry); if (d && d >= monday) entriesThisWeek["o" + r.entry + r.underlying + r.strikes] = 1; });
    journal.forEach(function (r) { var d = C.parseDate(r.date); if (d && d >= monday && r.track !== "0DTE") entriesThisWeek["j" + r.date + r.underlying] = 1; });
    var risk = open.reduce(function (a, r) { return a + (+r.maxLoss || 0); }, 0);
    return { open: open, lockUntil: lockUntil, live: live, weekEntries: Object.keys(entriesThisWeek).length, risk: risk };
  }

  function render() {
    var st = status();
    var t = ticks();
    var ct = centralNow();
    var weekend = ct && (ct.weekday === "Sat" || ct.weekday === "Sun");
    var inWindow = ct && !weekend && ct.mins >= 8 * 60 + 30 && ct.mins <= 10 * 60;
    var stopped = st.live <= -S.stopLossTotal;
    var full = st.open.length >= S.maxOpenPositions || st.risk >= S.maxTotalOpenRisk;
    var canEnter = !st.lockUntil && !stopped && !full && st.weekEntries < S.newTradesPerWeek;

    $("today-date").textContent = C.prettyDate(today);
    var chips = [];
    chips.push(['<span>Central time</span><b>' + (ct ? ct.label : "—") + "</b>", inWindow ? "good" : "", inWindow ? "Inside your trading window" : weekend ? "Weekend — market closed" : "Outside " + S.tradingWindow]);
    chips.push(["<span>Lockout</span><b>" + (st.lockUntil ? "Until " + C.prettyDate(st.lockUntil) : "None") + "</b>", st.lockUntil ? "bad" : "good", st.lockUntil ? "Last " + S.lockoutLosses + " trades were losses" : "OK to trade"]);
    chips.push(["<span>Live P&amp;L vs stop</span><b>" + C.money(st.live) + "</b>", stopped ? "bad" : "good", stopped ? "Stop hit — paperMoney only" : "Stop at −" + C.money(S.stopLossTotal, 0)]);
    chips.push(["<span>Open positions / risk</span><b>" + st.open.length + " / " + C.money(st.risk, 0) + "</b>", full ? "warn" : "good", "Max " + S.maxOpenPositions + " / " + C.money(S.maxTotalOpenRisk, 0)]);
    chips.push(["<span>New trades this week</span><b>" + st.weekEntries + " of " + S.newTradesPerWeek + "</b>", canEnter ? "good" : "", canEnter ? "An entry is allowed today" : "No new entry today"]);
    $("status").innerHTML = chips.map(function (c) {
      return '<div class="chip ' + c[1] + '">' + c[0] + '<small>' + C.esc(c[2]) + "</small></div>";
    }).join("");

    // What needs doing today
    var todo = [];
    st.open.forEach(function (r) {
      var due = C.parseDate(r.close21);
      var days = due ? C.daysBetween(today, due) : null;
      var label = C.esc(r.underlying + " " + r.structure + " " + r.strikes);
      if (days !== null && days <= 0) {
        todo.push('<div class="alert bad"><strong>Close today:</strong> ' + label + " reached its " + S.closeAtDTE + "-DTE date (" + C.prettyDate(due) + "). Close it regardless of P&amp;L, then log the exit.</div>");
      } else {
        todo.push('<div class="alert good">' + label + " — glance: has the GTC at " + C.money(r.gtc) + " filled? " +
          (days !== null ? days + " day" + (days === 1 ? "" : "s") + " until the close date (" + C.prettyDate(due) + ")." : "") + "</div>");
      }
    });
    if (!st.open.length) todo.push('<p class="muted">No saved open positions. Positions you save in the <a href="ticket.html">trade ticket</a> show up here.</p>');
    if (canEnter && !weekend) todo.push('<div class="alert good"><strong>Entry allowed today.</strong> If you want a new trade, follow the entry-day checklist and run the <a href="ticket.html">trade ticket</a>.</div>');
    $("todo").innerHTML = todo.join("");

    $("lists").innerHTML = GROUPS.map(function (g) {
      var dim = g.id === "entry" && !canEnter;
      return '<section class="card' + (dim ? " dim" : "") + '"><h2 style="margin-top:0">' + C.esc(g.title) + "</h2>" +
        (dim ? '<p class="small muted">Not an entry day for you right now (see the status above). Shown for reference.</p>' : "") +
        '<ul class="checklist plain">' + g.items.map(function (it) {
          return '<li><label class="check"><input type="checkbox" id="ck-' + it[0] + '" data-k="' + it[0] + '"' + (t.done[it[0]] ? " checked" : "") + "> <span>" + C.esc(it[1]) + "</span></label></li>";
        }).join("") + "</ul></section>";
    }).join("");
    $("lists").querySelectorAll("input[data-k]").forEach(function (cb) {
      cb.addEventListener("change", function () {
        var cur = ticks();
        if (cb.checked) cur.done[cb.getAttribute("data-k")] = true; else delete cur.done[cb.getAttribute("data-k")];
        C.save(KEY, cur);
      });
    });
  }

  $("reset-ticks").addEventListener("click", function () { C.save(KEY, { date: todayStr, done: {} }); render(); });
  render();
})();
