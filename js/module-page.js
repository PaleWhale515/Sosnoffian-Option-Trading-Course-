/* Loads a module's Markdown (modules/*.md), renders it, and mounts quizzes and payoff diagrams.
   Over http(s) it fetches the .md file directly; when opened from disk (file://) it falls back
   to js/modules-bundle.js, which tools/build_bundle.py generates from the same .md files. */
(function () {
  "use strict";
  var C = window.Course;
  var params = new URLSearchParams(location.search);
  var hm = /^#m(\d\d)$/.exec(location.hash);
  var id = params.get("m") || (hm && hm[1]) || "01";
  if (!window.Shell) window.addEventListener("hashchange", function () { if (/^#m\d\d$/.test(location.hash)) location.reload(); });
  var idx = C.MODULES.findIndex(function (m) { return m.id === id; });
  var main = document.getElementById("content");

  if (idx < 0) { main.innerHTML = "<p>Module not found. <a href=\"index.html\">Back to the course</a>.</p>"; return; }
  var mod = C.MODULES[idx];
  document.title = "Module " + mod.id + ": " + mod.title + " · Premium Selling the Sosnoff Way";

  function fromBundle() {
    var b = window.MODULE_SOURCES || {};
    return b[mod.file] !== undefined ? Promise.resolve(b[mod.file]) : Promise.reject(new Error("not in bundle"));
  }
  function getSource() {
    if (/^https?:$/.test(location.protocol)) {
      return fetch("modules/" + mod.file, { cache: "no-cache" })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
        .catch(fromBundle);
    }
    return fromBundle();
  }

  getSource().then(function (src) {
    var r = window.MD.render(src);
    main.innerHTML = r.html;
    var quizN = 0;
    main.querySelectorAll(".md-widget").forEach(function (slot) {
      var w = r.widgets[+slot.getAttribute("data-widget")];
      try {
        var data = JSON.parse(w.src);
        if (w.type === "quiz") {
          quizN++;
          window.Quiz.mount(slot, { id: "module-" + mod.id, title: "Module " + mod.id + " quiz", questions: data });
        } else if (w.type === "payoff") {
          window.Payoff.embed(slot, data);
        }
      } catch (e) {
        slot.innerHTML = '<div class="alert bad">Could not render this block: ' + C.esc(e.message) + "</div>";
      }
    });
    var nav = document.createElement("div");
    nav.className = "module-nav";
    var prev = C.MODULES[idx - 1], next = C.MODULES[idx + 1];
    nav.innerHTML = (prev ? '<a class="btn secondary" href="' + C.moduleHref(prev.id) + '\">← ' + prev.id + " " + C.esc(prev.title) + "</a>" : "<span></span>") +
      '<a class="btn secondary" href="index.html">Course map</a>' +
      (next ? '<a class="btn" href="' + C.moduleHref(next.id) + '\">' + next.id + " " + C.esc(next.title) + " →</a>" : "<span></span>");
    main.appendChild(nav);
    if (location.hash && !hm) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }).catch(function (e) {
    main.innerHTML = '<div class="alert bad">Could not load module file <code>modules/' + C.esc(mod.file) +
      "</code>. Run <code>python3 tools/build_bundle.py</code> or serve the folder with <code>python3 -m http.server</code>. (" + C.esc(e.message) + ")</div>";
  });
})();
