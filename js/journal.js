/* Trade journal: in-browser log with CSV import/export. Data lives in localStorage only. */
(function () {
  "use strict";
  var C = window.Course;

  var FIELDS = [
    ["date", "Entry date"], ["track", "Track"], ["underlying", "Underlying"], ["structure", "Structure"],
    ["dte", "DTE at entry"], ["iv_rank", "IV rank"], ["credit", "Credit ($)"], ["max_loss", "Max loss ($)"],
    ["exit_reason", "Exit reason"], ["pnl", "P&L ($)"], ["rule_followed", "Rule followed (Y/N)"], ["notes", "Notes"],
    ["exit_date", "Exit date"], ["mode", "Mode (paper/live)"]
  ];
  var EXIT_REASONS = ["50% target", "21 DTE", "expired", "other"];

  function all() { return C.load(C.KEYS.journal, []); }
  function store(rows) { C.save(C.KEYS.journal, rows); }

  function csvCell(v) {
    var s = v === undefined || v === null ? "" : String(v);
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function toCSV(rows) {
    return [FIELDS.map(function (f) { return f[0]; }).join(",")].concat(rows.map(function (r) {
      return FIELDS.map(function (f) { return csvCell(r[f[0]]); }).join(",");
    })).join("\r\n") + "\r\n";
  }
  function parseCSV(text) {
    var rows = [], row = [], cell = "", q = false;
    text = text.replace(/^﻿/, "");
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) {
        if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(cell); cell = "";
        if (row.some(function (c) { return c !== ""; })) rows.push(row);
        row = [];
      } else cell += ch;
    }
    row.push(cell);
    if (row.some(function (c) { return c !== ""; })) rows.push(row);
    if (!rows.length) return [];
    var head = rows[0].map(function (h) { return h.trim().toLowerCase().replace(/\s+/g, "_"); });
    return rows.slice(1).map(function (r) {
      var o = {};
      head.forEach(function (h, i) { o[h] = (r[i] || "").trim(); });
      return o;
    });
  }

  window.Journal = { FIELDS: FIELDS, EXIT_REASONS: EXIT_REASONS, all: all, store: store, toCSV: toCSV, parseCSV: parseCSV };

  var form = document.getElementById("entry-form");
  if (!form) return; // loaded by the scorecard page for data access only

  var editing = -1;

  function formValues() {
    var o = {};
    FIELDS.forEach(function (f) { var el = form.elements[f[0]]; o[f[0]] = el ? el.value.trim() : ""; });
    return o;
  }
  function setForm(r) {
    FIELDS.forEach(function (f) { var el = form.elements[f[0]]; if (el) el.value = r[f[0]] !== undefined ? r[f[0]] : ""; });
  }
  function resetForm() {
    form.reset();
    form.elements.date.value = C.fmtDate(C.today());
    form.elements.track.value = "45DTE";
    form.elements.mode.value = "paper";
    editing = -1;
    document.getElementById("save").textContent = "Add trade";
  }

  function render() {
    var rows = all();
    var tb = document.getElementById("rows");
    document.getElementById("count").textContent = rows.length + " trade" + (rows.length === 1 ? "" : "s");
    if (!rows.length) { tb.innerHTML = '<tr><td colspan="' + (FIELDS.length + 1) + '" class="muted">No trades logged yet.</td></tr>'; return; }
    tb.innerHTML = rows.map(function (r, i) {
      return "<tr>" + FIELDS.map(function (f) {
        var v = r[f[0]];
        var num = ["dte", "iv_rank", "credit", "max_loss", "pnl"].indexOf(f[0]) >= 0;
        if (f[0] === "pnl" && v !== "" && !isNaN(parseFloat(v))) v = C.money(parseFloat(v));
        return "<td" + (num ? ' class="num"' : "") + ">" + C.esc(v) + "</td>";
      }).join("") + '<td><button type="button" class="secondary" data-edit="' + i + '">Edit</button> <button type="button" class="danger" data-del="' + i + '">Delete</button></td></tr>';
    }).join("");
    tb.querySelectorAll("[data-edit]").forEach(function (b) {
      b.addEventListener("click", function () {
        editing = +b.getAttribute("data-edit");
        setForm(all()[editing]);
        document.getElementById("save").textContent = "Update trade";
        form.scrollIntoView({ behavior: "smooth" });
      });
    });
    tb.querySelectorAll("[data-del]").forEach(function (b) {
      C.armConfirm(b, function () {
        var r = all(); r.splice(+b.getAttribute("data-del"), 1); store(r); render();
      });
    });
  }

  function validate(o) {
    var errs = [];
    if (!C.parseDate(o.date)) errs.push("Entry date is required (YYYY-MM-DD).");
    if (!o.underlying) errs.push("Underlying is required.");
    if (o.exit_date && !C.parseDate(o.exit_date)) errs.push("Exit date must be YYYY-MM-DD.");
    if (o.exit_date && C.parseDate(o.date) && C.parseDate(o.exit_date) < C.parseDate(o.date)) errs.push("Exit date is before entry date.");
    ["dte", "iv_rank", "credit", "max_loss", "pnl"].forEach(function (k) { if (o[k] !== "" && isNaN(parseFloat(o[k]))) errs.push(k + " must be a number."); });
    if (o.max_loss !== "" && parseFloat(o.max_loss) > C.getSettings().maxRiskPerTrade)
      errs.push("Note: max loss is above your per-trade limit — mark rule followed = N if this was live.");
    return errs;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var o = formValues();
    o.underlying = o.underlying.toUpperCase();
    var errs = validate(o);
    var msg = document.getElementById("form-msg");
    var hard = errs.filter(function (x) { return !/^Note:/.test(x); });
    msg.innerHTML = errs.map(function (x) { return '<div class="alert ' + (/^Note:/.test(x) ? "warn" : "bad") + '">' + C.esc(x) + "</div>"; }).join("");
    if (hard.length) return;
    var rows = all();
    if (editing >= 0) rows[editing] = o; else rows.push(o);
    store(rows);
    resetForm();
    render();
    if (!errs.length) msg.innerHTML = '<div class="alert good">Saved.</div>';
  });
  document.getElementById("clear-form").addEventListener("click", resetForm);
  document.getElementById("export").addEventListener("click", function () {
    C.download("trade-journal-" + C.fmtDate(C.today()) + ".csv", toCSV(all()), "text/csv").catch(function () {
      document.getElementById("form-msg").innerHTML = '<div class="alert warn">The file was not saved. Use “Copy CSV” instead.</div>';
    });
  });
  document.getElementById("copy-csv").addEventListener("click", function () {
    var btn = this, box = document.getElementById("csv-text");
    box.value = toCSV(all());
    C.copyText(box.value, box).then(function (ok) {
      btn.textContent = ok ? "Copied" : "Select and copy the text below";
      setTimeout(function () { btn.textContent = "Copy CSV"; }, 2500);
    });
  });
  document.getElementById("import").addEventListener("change", function (e) {
    var f = e.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      var rows = parseCSV(String(reader.result)).map(function (r) {
        var o = {}; FIELDS.forEach(function (fl) { o[fl[0]] = r[fl[0]] || ""; }); return o;
      }).filter(function (r) { return r.date || r.underlying; });
      var replace = document.getElementById("import-replace").checked;
      store(replace ? rows : all().concat(rows));
      render();
      document.getElementById("form-msg").innerHTML = '<div class="alert good">Imported ' + rows.length + " row(s).</div>";
      e.target.value = "";
    };
    reader.readAsText(f);
  });

  resetForm();
  var pre = new URLSearchParams(location.search).get("prefill");
  if (!pre && /prefill$/.test(location.hash)) {
    try { pre = sessionStorage.getItem("sosnoff.prefill"); sessionStorage.removeItem("sosnoff.prefill"); } catch (err) { pre = null; }
  }
  if (pre) {
    try {
      var p = JSON.parse(pre);
      Object.keys(p).forEach(function (k) { if (form.elements[k]) form.elements[k].value = p[k]; });
      form.elements.exit_date.value = C.fmtDate(C.today());
      document.getElementById("form-msg").innerHTML = '<div class="alert good">Pre-filled from the trade ticket. Add the exit reason, P&amp;L and rule-followed, then save.</div>';
    } catch (err) { /* ignore malformed prefill */ }
  }
  render();
})();
