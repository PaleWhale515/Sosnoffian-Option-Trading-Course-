/* Payoff-at-expiration engine and SVG chart for every structure in Modules 3 and 10.
   All default numbers are ILLUSTRATIVE, not quotes. */
(function () {
  "use strict";
  var C = window.Course;

  function put(q, k) { return { t: "P", q: q, k: k }; }
  function call(q, k) { return { t: "C", q: q, k: k }; }

  var STRUCTURES = {
    "short-put-vertical": {
      name: "Short put vertical (bull put spread)", module: "03", approval: "Level 2 (Spreads)", premium: "credit",
      fields: [["longPut", "Long put strike (lower)"], ["shortPut", "Short put strike (higher)"]],
      legs: function (p) { return [put(-1, p.shortPut), put(1, p.longPut)]; },
      defaults: { spot: 50, longPut: 46, shortPut: 47, premium: 0.25 },
      note: "Bullish-to-neutral. Profits if the underlying stays above the short put."
    },
    "short-call-vertical": {
      name: "Short call vertical (bear call spread)", module: "03", approval: "Level 2 (Spreads)", premium: "credit",
      fields: [["shortCall", "Short call strike (lower)"], ["longCall", "Long call strike (higher)"]],
      legs: function (p) { return [call(-1, p.shortCall), call(1, p.longCall)]; },
      defaults: { spot: 50, shortCall: 53, longCall: 54, premium: 0.25 },
      note: "Bearish-to-neutral. Profits if the underlying stays below the short call."
    },
    "iron-condor": {
      name: "Iron condor", module: "03", approval: "Level 2 (Spreads)", premium: "credit",
      fields: [["longPut", "Long put"], ["shortPut", "Short put"], ["shortCall", "Short call"], ["longCall", "Long call"]],
      legs: function (p) { return [put(1, p.longPut), put(-1, p.shortPut), call(-1, p.shortCall), call(1, p.longCall)]; },
      defaults: { spot: 50, longPut: 46, shortPut: 47, shortCall: 53, longCall: 54, premium: 0.40 },
      note: "Neutral. A short put vertical plus a short call vertical; only one side can lose at expiration."
    },
    "jade-lizard": {
      name: "Jade lizard (advanced — naked put)", module: "03", approval: "Level 3 (Uncovered) — naked put", premium: "credit",
      fields: [["shortPut", "Short put (naked)"], ["shortCall", "Short call"], ["longCall", "Long call"]],
      legs: function (p) { return [put(-1, p.shortPut), call(-1, p.shortCall), call(1, p.longCall)]; },
      defaults: { spot: 50, shortPut: 47, shortCall: 53, longCall: 54, premium: 1.10 },
      note: "Credit ≥ call-spread width removes upside risk, but the naked put makes downside risk large. Does NOT fit a $100 limit."
    },
    "short-strangle": {
      name: "Short strangle (Level 3 — concept only)", module: "03", approval: "Level 3 (Uncovered)", premium: "credit",
      fields: [["shortPut", "Short put"], ["shortCall", "Short call"]],
      legs: function (p) { return [put(-1, p.shortPut), call(-1, p.shortCall)]; },
      defaults: { spot: 50, shortPut: 46, shortCall: 54, premium: 0.80 },
      note: "Undefined risk. The structure most tastylive studies used — shown for concept only."
    },
    "0dte-long-call": {
      name: "0DTE long OTM call (\"lotto\")", module: "10", approval: "Level 1 (Long)", premium: "debit",
      fields: [["strike", "Call strike"]],
      legs: function (p) { return [call(1, p.strike)]; },
      defaults: { spot: 600, strike: 603, premium: 0.20 },
      note: "The trade the student has historically lost on. Needs a large move in hours."
    },
    "0dte-long-put": {
      name: "0DTE long OTM put (\"lotto\")", module: "10", approval: "Level 1 (Long)", premium: "debit",
      fields: [["strike", "Put strike"]],
      legs: function (p) { return [put(1, p.strike)]; },
      defaults: { spot: 600, strike: 597, premium: 0.20 },
      note: "Same problem as the long call, mirrored."
    },
    "0dte-short-put-vertical": {
      name: "0DTE short put vertical", module: "10", approval: "Level 2 (Spreads)", premium: "credit",
      fields: [["longPut", "Long put (lower)"], ["shortPut", "Short put (higher)"]],
      legs: function (p) { return [put(-1, p.shortPut), put(1, p.longPut)]; },
      defaults: { spot: 600, longPut: 595, shortPut: 596, premium: 0.20 },
      note: "Format A or B. $1 wide, so max loss stays under $100."
    },
    "0dte-short-call-vertical": {
      name: "0DTE short call vertical", module: "10", approval: "Level 2 (Spreads)", premium: "credit",
      fields: [["shortCall", "Short call (lower)"], ["longCall", "Long call (higher)"]],
      legs: function (p) { return [call(-1, p.shortCall), call(1, p.longCall)]; },
      defaults: { spot: 600, shortCall: 604, longCall: 605, premium: 0.20 },
      note: "Format A or B, bearish-to-neutral side."
    },
    "0dte-iron-condor": {
      name: "0DTE iron condor", module: "10", approval: "Level 2 (Spreads)", premium: "credit",
      fields: [["longPut", "Long put"], ["shortPut", "Short put"], ["shortCall", "Short call"], ["longCall", "Long call"]],
      legs: function (p) { return [put(1, p.longPut), put(-1, p.shortPut), call(-1, p.shortCall), call(1, p.longCall)]; },
      defaults: { spot: 600, longPut: 594, shortPut: 595, shortCall: 605, longCall: 606, premium: 0.30 },
      note: "Format B bracket candidate. Gamma makes the short strikes move into play fast."
    }
  };

  function intrinsic(leg, s) { return leg.t === "C" ? Math.max(0, s - leg.k) : Math.max(0, leg.k - s); }

  function analyze(key, p) {
    var st = STRUCTURES[key];
    var qty = p.qty || 1;
    var legs = st.legs(p);
    var net = st.premium === "credit" ? p.premium : -p.premium;
    function pl(s) {
      var v = net;
      legs.forEach(function (l) { v += l.q * intrinsic(l, s); });
      return v * 100 * qty;
    }
    var strikes = legs.map(function (l) { return l.k; }).sort(function (a, b) { return a - b; });
    var callSlope = legs.reduce(function (a, l) { return a + (l.t === "C" ? l.q : 0); }, 0);
    var pts = [0].concat(strikes);
    var vals = pts.map(pl);
    var maxP = Math.max.apply(null, vals), maxL = Math.min.apply(null, vals);
    var unlimitedProfit = callSlope > 0, unlimitedLoss = callSlope < 0;
    // Breakevens: roots of the piecewise-linear P&L between breakpoints, plus beyond the top strike.
    var bps = pts.concat([strikes[strikes.length - 1] * 3]);
    var bes = [];
    for (var i = 0; i < bps.length - 1; i++) {
      var a = bps[i], b = bps[i + 1], fa = pl(a), fb = pl(b);
      if (fa === 0 && i > 0) { if (bes.indexOf(a) < 0) bes.push(a); }
      else if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) bes.push(a + (b - a) * (fa / (fa - fb)));
    }
    var lowRiskAtZero = pl(0) === maxL && legs.some(function (l) { return l.t === "P" && l.q < 0; }) &&
      !legs.some(function (l) { return l.t === "P" && l.q > 0; });
    return {
      st: st, legs: legs, pl: pl, strikes: strikes,
      maxProfit: unlimitedProfit ? Infinity : maxP,
      maxLoss: unlimitedLoss ? -Infinity : maxL,
      lossOnlyIfZero: lowRiskAtZero,
      breakevens: bes.map(function (x) { return Math.round(x * 100) / 100; }),
      qty: qty
    };
  }

  function svgChart(res, spot) {
    var W = 640, H = 310, L = 58, R = 14, T = 14, B = 44;
    var ks = res.strikes;
    var lo = Math.min(ks[0], spot), hi = Math.max(ks[ks.length - 1], spot);
    var pad = Math.max((hi - lo) * 0.6, spot * 0.02, 1);
    var x0 = Math.max(0, lo - pad), x1 = hi + pad;
    var N = 240, xs = [], ys = [];
    for (var i = 0; i <= N; i++) { var s = x0 + (x1 - x0) * i / N; xs.push(s); ys.push(res.pl(s)); }
    ks.forEach(function (k) { xs.push(k); ys.push(res.pl(k)); });
    var order = xs.map(function (x, j) { return [x, ys[j]]; }).sort(function (a, b) { return a[0] - b[0]; });
    var yMin = Math.min(0, Math.min.apply(null, ys)), yMax = Math.max(0, Math.max.apply(null, ys));
    var yPad = (yMax - yMin) * 0.1 || 10; yMin -= yPad; yMax += yPad;
    function X(v) { return L + (v - x0) / (x1 - x0) * (W - L - R); }
    function Y(v) { return T + (yMax - v) / (yMax - yMin) * (H - T - B); }
    var path = order.map(function (p, j) { return (j ? "L" : "M") + X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1); }).join("");
    var y0 = Y(0);
    var area = "M" + X(order[0][0]).toFixed(1) + "," + y0.toFixed(1) +
      order.map(function (p) { return "L" + X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1); }).join("") +
      "L" + X(order[order.length - 1][0]).toFixed(1) + "," + y0.toFixed(1) + "Z";
    var g = "";
    for (var t = 0; t <= 4; t++) {
      var yv = yMin + (yMax - yMin) * t / 4;
      g += '<line class="grid-line" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(yv).toFixed(1) + '" y2="' + Y(yv).toFixed(1) + '"/>' +
        '<text x="' + (L - 6) + '" y="' + (Y(yv) + 4).toFixed(1) + '" text-anchor="end">' + C.money(yv, 0) + "</text>";
    }
    var ticks = ks.concat([spot]).filter(function (v, j, arr) { return arr.indexOf(v) === j; });
    ticks.forEach(function (k) {
      g += '<text x="' + X(k).toFixed(1) + '" y="' + (H - B + 16) + '" text-anchor="middle">' + k + "</text>";
    });
    var be = res.breakevens.map(function (b) {
      return '<line class="be-line" x1="' + X(b).toFixed(1) + '" x2="' + X(b).toFixed(1) + '" y1="' + T + '" y2="' + (H - B) + '"/>';
    }).join("");
    var dots = ks.map(function (k) { return '<circle class="strike-dot" cx="' + X(k).toFixed(1) + '" cy="' + Y(res.pl(k)).toFixed(1) + '" r="3"/>'; }).join("");
    var clipId = "c" + Math.random().toString(36).slice(2, 8);
    return '<svg class="payoff" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Profit and loss at expiration">' +
      '<defs><clipPath id="' + clipId + 'p"><rect x="0" y="0" width="' + W + '" height="' + y0.toFixed(1) + '"/></clipPath>' +
      '<clipPath id="' + clipId + 'l"><rect x="0" y="' + y0.toFixed(1) + '" width="' + W + '" height="' + (H - y0).toFixed(1) + '"/></clipPath></defs>' +
      g +
      '<path class="profit-area" d="' + area + '" clip-path="url(#' + clipId + 'p)"/>' +
      '<path class="loss-area" d="' + area + '" clip-path="url(#' + clipId + 'l)"/>' +
      '<line class="zero-line" x1="' + L + '" x2="' + (W - R) + '" y1="' + y0.toFixed(1) + '" y2="' + y0.toFixed(1) + '"/>' +
      '<line class="spot-line" x1="' + X(spot).toFixed(1) + '" x2="' + X(spot).toFixed(1) + '" y1="' + T + '" y2="' + (H - B) + '"/>' +
      be + '<path class="pl-line" d="' + path + '"/>' + dots +
      '<text x="' + (W - R) + '" y="' + (H - 1) + '" text-anchor="end">Underlying price at expiration (blue dashed = current, orange = breakeven)</text>' +
      "</svg>";
  }

  function fmtMax(v, res, isLoss) {
    if (v === Infinity) return "Unlimited";
    if (v === -Infinity) return "Unlimited";
    if (isLoss && res.lossOnlyIfZero) return C.money(v, 0) + " (if underlying → $0)";
    return C.money(v, 0);
  }

  function summaryHTML(res, settings) {
    var limit = settings ? settings.maxRiskPerTrade : 100;
    var lossAbs = res.maxLoss === -Infinity ? Infinity : Math.abs(Math.min(0, res.maxLoss));
    var fits = lossAbs <= limit;
    return '<div class="kv">' +
      "<div><span>Max profit</span><b>" + fmtMax(res.maxProfit, res, false) + "</b></div>" +
      "<div><span>Max loss</span><b>" + fmtMax(res.maxLoss, res, true) + "</b></div>" +
      "<div><span>Breakeven(s)</span><b>" + (res.breakevens.length ? res.breakevens.join(" / ") : "—") + "</b></div>" +
      "<div><span>Approval needed</span><b style=\"font-size:0.95rem\">" + C.esc(res.st.approval) + "</b></div>" +
      "</div>" +
      '<div class="alert ' + (fits ? "good" : "bad") + '">' +
      (fits ? "Max loss is within your " + C.money(limit, 0) + " per-trade limit." :
        "Max loss exceeds your " + C.money(limit, 0) + " per-trade limit — not allowed under your rulebook.") + "</div>";
  }

  /* Embed a read-only diagram (used inside modules via ```payoff blocks). */
  function embed(container, cfg) {
    var key = cfg.structure;
    var st = STRUCTURES[key];
    if (!st) { container.textContent = "Unknown structure: " + key; return; }
    var p = {};
    Object.keys(st.defaults).forEach(function (k) { p[k] = st.defaults[k]; });
    Object.keys(cfg).forEach(function (k) { if (k !== "structure" && k !== "caption") p[k] = cfg[k]; });
    var res = analyze(key, p);
    var legsTxt = res.legs.map(function (l) { return (l.q > 0 ? "+" : "−") + Math.abs(l.q) + " " + l.k + (l.t === "C" ? "C" : "P"); }).join(", ");
    var box = document.createElement("figure");
    box.className = "payoff-embed";
    box.innerHTML = "<strong>" + C.esc(st.name) + "</strong> " + '<span class="badge illus">Illustrative</span>' +
      '<div class="caption">Underlying ' + p.spot + " · legs " + legsTxt + " · " + st.premium + " " + C.money(p.premium) + " per share</div>" +
      svgChart(res, p.spot) + summaryHTML(res, C.getSettings()) +
      '<figcaption class="caption">' + C.esc(cfg.caption || st.note) +
      ' <a href="payoff.html#' + key + '">Open in the payoff tool →</a></figcaption>';
    container.appendChild(box);
  }

  window.Payoff = { STRUCTURES: STRUCTURES, analyze: analyze, svgChart: svgChart, summaryHTML: summaryHTML, embed: embed };
})();
