/* Single-page shell. When the course is served over http(s) (including the hosted claude.ai
   version), index.html loads the other pages into itself and routes by hash: #home, #m05,
   #ticket, #payoff.iron-condor, #journal.prefill, ... Keeping one page lets the hosted
   viewer's sync and save features work everywhere. From file:// (where browsers block fetch)
   links simply navigate between the separate .html files. */
(function () {
  "use strict";
  var C = window.Course;
  var PAGES = ["placement", "ticket", "payoff", "journal", "scorecard", "rulebook", "sources", "checklist"];
  var SHARED = ["js/sync.js", "js/common.js", "js/md.js", "js/quiz.js", "js/payoff.js", "js/modules-bundle.js", "js/shell.js"];
  var cache = {};
  var home = null;      // { html, attrs } captured from index.html before home.js runs
  var active = false;
  var renderSeq = 0;

  /* Map an href to a route, or null if it is not a course page. */
  function routeFor(href) {
    if (!href || /^(https?:|mailto:|tel:|#|data:|blob:)/i.test(href)) return null;
    var m = /^([\w-]+)\.html(?:\?m=(\d\d))?(?:#([\w.~-]*))?$/.exec(href);
    if (!m) return null;
    var page = m[1], q = m[2], h = m[3] || "";
    if (page === "index") return "home";
    if (page === "module") return "m" + (q || (/^m\d\d$/.test(h) ? h.slice(1) : "01"));
    if (PAGES.indexOf(page) < 0) return null;
    return h ? page + "." + h : page;
  }

  function parse(hash) {
    var r = (hash || "").replace(/^#/, "") || "home";
    if (/^m\d\d$/.test(r)) return { file: "module.html", route: r };
    var base = r.split(".")[0];
    if (PAGES.indexOf(base) >= 0) return { file: base + ".html", route: r };
    return { file: "index.html", route: "home" };
  }

  function loadScript(src, text) {
    return new Promise(function (resolve) {
      var s = document.createElement("script");
      if (src) { s.src = src; s.onload = resolve; s.onerror = resolve; }
      else { s.textContent = text; }
      s.setAttribute("data-page-script", "1");
      document.body.appendChild(s);
      if (!src) resolve();
    });
  }

  function swapMain(newMain) {
    var old = document.querySelector("main");
    old.replaceWith(newMain);
    window.scrollTo(0, 0);
  }

  function fetchPage(file) {
    if (cache[file]) return Promise.resolve(cache[file]);
    return fetch(file, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(file + " " + r.status);
      return r.text();
    }).then(function (t) { cache[file] = t; return t; });
  }

  function render() {
    var target = parse(location.hash);
    var seq = ++renderSeq;
    document.querySelectorAll("script[data-page-script]").forEach(function (s) { s.remove(); });
    var style = document.getElementById("page-style");
    C.setActiveNav(target.file);

    if (target.file === "index.html") {
      style.textContent = "";
      var main = document.createElement("main");
      main.innerHTML = home.html;
      swapMain(main);
      document.title = home.title;
      document.querySelector("footer.disclaimer").innerHTML = home.footer;
      return loadScript("js/home.js");
    }
    return fetchPage(target.file).then(function (text) {
      if (seq !== renderSeq) return;
      var doc = new DOMParser().parseFromString(text, "text/html");
      var main = document.importNode(doc.querySelector("main"), true);
      style.textContent = Array.prototype.map.call(doc.querySelectorAll("head style"), function (s) { return s.textContent; }).join("\n");
      swapMain(main);
      if (doc.title) document.title = doc.title;
      var foot = doc.querySelector("footer.disclaimer");
      if (foot) document.querySelector("footer.disclaimer").innerHTML = foot.innerHTML;
      var scripts = Array.prototype.slice.call(doc.querySelectorAll("body script"));
      return scripts.reduce(function (p, s) {
        return p.then(function () {
          if (seq !== renderSeq) return;
          var src = s.getAttribute("src");
          if (src && SHARED.indexOf(src) >= 0) return;
          return loadScript(src, src ? null : s.textContent);
        });
      }, Promise.resolve());
    }).catch(function (e) {
      var main = document.createElement("main");
      main.innerHTML = '<div class="alert bad">Could not open this page (' + C.esc(e.message) + '). <a href="index.html">Back to the course</a>.</div>';
      swapMain(main);
    });
  }

  function onClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    var route = routeFor(a.getAttribute("href"));
    if (!route) return;
    e.preventDefault();
    if (location.hash === "#" + route) render(); else location.hash = route;
  }

  function start() {
    var main = document.querySelector("main");
    home = { html: main.innerHTML, title: document.title, footer: document.querySelector("footer.disclaimer").innerHTML };
    var st = document.createElement("style");
    st.id = "page-style";
    document.head.appendChild(st);
    active = true;
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", render);
    // Home is already on screen (home.js runs next); render any other route now.
    if (parse(location.hash).file !== "index.html") render();
  }

  /* Re-render after sync brings newer data from another device. */
  function refresh() { if (active) render(); else location.reload(); }

  window.Shell = { render: render, refresh: refresh, routeFor: routeFor, isActive: function () { return active; } };

  if (/^https?:$/.test(location.protocol)) start();
  else window.Shell = null; // file://: plain multi-page navigation

  if (window.Sync) {
    window.Sync.init().then(function (changed) { if (changed) refresh(); });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") window.Sync.pull().then(function (changed) { if (changed) refresh(); });
    });
  }
})();
