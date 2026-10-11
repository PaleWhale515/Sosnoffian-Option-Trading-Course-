/* Shared helpers: course registry, storage, settings, header/footer, formatting.
   Everything runs locally in the browser; nothing is sent anywhere. */
(function () {
  "use strict";

  var COURSE_TITLE = "Premium Selling the Sosnoff Way — Set It, Manage It, Repeat";

  var MODULES = [
    { id: "01", file: "01-option-fundamentals.md", title: "Option Fundamentals", track: "main" },
    { id: "02", file: "02-implied-volatility.md", title: "Implied Volatility", track: "main" },
    { id: "03", file: "03-structures.md", title: "Structures", track: "main" },
    { id: "04", file: "04-trade-selection.md", title: "Trade Selection", track: "main" },
    { id: "05", file: "05-the-routine.md", title: "The 45-DTE Routine", track: "main" },
    { id: "06", file: "06-sizing-and-pacing.md", title: "Position Sizing & Pacing", track: "main" },
    { id: "07", file: "07-win-rate-math.md", title: "Winning-Rate Math", track: "main" },
    { id: "08", file: "08-why-lotto-buying-loses.md", title: "Why Lotto Buying Loses", track: "lab" },
    { id: "09", file: "09-0dte-mechanics.md", title: "0DTE Mechanics", track: "lab" },
    { id: "10", file: "10-0dte-formats.md", title: "Two Workable 0DTE Formats", track: "lab" },
    { id: "11", file: "11-comparison.md", title: "Comparison: 0DTE vs. 45 DTE", track: "compare" },
    { id: "12", file: "12-account-and-rules.md", title: "Account & Rules", track: "account" }
  ];

  var DEFAULT_SETTINGS = {
    traderName: "",
    maxRiskPerTrade: 100,
    maxContracts: 1,
    maxOpenPositions: 3,
    maxTotalOpenRisk: 300,
    stopLossTotal: 300,
    lockoutLosses: 2,
    lockoutHours: 24,
    targetDTE: 45,
    profitTargetPct: 50,
    closeAtDTE: 21,
    newTradesPerWeek: 1,
    tradingWindow: "8:30–10:00 AM Central",
    checkFrequency: "Once each morning",
    minIVRank: 30,
    approvalLevel: "Level 2 (Spreads) — pending",
    zeroDteEnabled: false
  };

  var KEYS = {
    settings: "sosnoff.settings",
    journal: "sosnoff.journal",
    open: "sosnoff.openPositions",
    quizPrefix: "sosnoff.quiz.",
    placement: "sosnoff.placement"
  };

  function load(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function save(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getSettings() {
    var s = load(KEYS.settings, {});
    var out = {};
    Object.keys(DEFAULT_SETTINGS).forEach(function (k) {
      out[k] = s[k] !== undefined && s[k] !== "" ? s[k] : DEFAULT_SETTINGS[k];
    });
    return out;
  }
  function saveSettings(s) { return save(KEYS.settings, s); }

  function esc(s) {
    return String(s === undefined || s === null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function money(n, digits) {
    if (n === null || n === undefined || isNaN(n)) return "—";
    var d = digits === undefined ? 2 : digits;
    var sign = n < 0 ? "−" : "";
    return sign + "$" + Math.abs(n).toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function pct(n, digits) {
    if (n === null || n === undefined || isNaN(n) || !isFinite(n)) return "—";
    return (n * 100).toFixed(digits === undefined ? 1 : digits) + "%";
  }

  /* Dates are handled as local calendar dates (YYYY-MM-DD) to avoid timezone drift. */
  function parseDate(s) {
    if (!s) return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3]);
  }
  function fmtDate(d) {
    if (!d) return "";
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    var dd = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mm + "-" + dd;
  }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; }
  function daysBetween(a, b) { return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000); }
  function prettyDate(d) {
    if (!d) return "—";
    return d.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" });
  }
  function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }

  var NAV = [
    ["index.html", "Course"],
    ["placement.html", "Placement quiz"],
    ["ticket.html", "Trade ticket"],
    ["payoff.html", "Payoff diagrams"],
    ["journal.html", "Journal"],
    ["scorecard.html", "Scorecard"],
    ["rulebook.html", "Rulebook"],
    ["sources.html", "Sources"]
  ];

  function renderChrome() {
    var here = (location.pathname.split("/").pop() || "index.html");
    if (here === "module.html") here = "index.html";
    var header = document.createElement("header");
    header.className = "site-header";
    var links = NAV.map(function (n) {
      return '<a href="' + n[0] + '"' + (n[0] === here ? ' class="active" aria-current="page"' : "") + ">" + n[1] + "</a>";
    }).join("");
    header.innerHTML =
      '<div class="inner"><a class="brand" href="index.html">Premium Selling the Sosnoff Way<small>Set It, Manage It, Repeat</small></a>' +
      '<nav class="main-nav" aria-label="Main">' + links + "</nav></div>";
    var top = document.createElement("div");
    top.className = "top-disclaimer";
    top.textContent = "Educational only — not personalized financial advice. Practice in paperMoney first.";
    document.body.insertBefore(top, document.body.firstChild);
    document.body.insertBefore(header, top.nextSibling);
  }

  /* Expected-value helpers shared by ticket, module math and scorecard. */
  function breakevenWinRate(avgWin, avgLoss) {
    // avgLoss as a positive number. p*W = (1-p)*L  =>  p = L / (W + L)
    if (!(avgWin > 0) || !(avgLoss >= 0)) return NaN;
    return avgLoss / (avgWin + avgLoss);
  }

  function download(filename, text, mime) {
    var blob = new Blob([text], { type: mime || "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  window.Course = {
    TITLE: COURSE_TITLE,
    MODULES: MODULES,
    DEFAULT_SETTINGS: DEFAULT_SETTINGS,
    KEYS: KEYS,
    load: load,
    save: save,
    getSettings: getSettings,
    saveSettings: saveSettings,
    esc: esc,
    money: money,
    pct: pct,
    parseDate: parseDate,
    fmtDate: fmtDate,
    addDays: addDays,
    daysBetween: daysBetween,
    prettyDate: prettyDate,
    today: today,
    breakevenWinRate: breakevenWinRate,
    download: download
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderChrome);
  } else {
    renderChrome();
  }
})();
