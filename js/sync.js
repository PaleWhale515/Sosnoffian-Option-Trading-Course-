/* Cross-device sync for the hosted (claude.ai) version.
   Each saved key (journal, open positions, settings, quiz scores, checklist) is mirrored to the
   viewer's private store at data/users/<id>/<key>. Locally (file:// or a plain web server) there
   is no window.claude, so this does nothing and the course uses this browser's storage only. */
(function () {
  "use strict";
  var C = window.Course;
  var META = "sosnoff.meta";
  var state = { db: null, uid: null, ready: false, status: "local", queue: {}, writing: false };
  var listeners = [];

  function meta() { try { return JSON.parse(localStorage.getItem(META) || "{}"); } catch (e) { return {}; } }
  function setMeta(m) { try { localStorage.setItem(META, JSON.stringify(m)); } catch (e) { /* storage unavailable */ } }
  function docId(key) { return key.replace(/[^\w.~:@+-]/g, "_"); }
  function setStatus(s) { state.status = s; listeners.forEach(function (fn) { fn(s); }); }

  /* Called by Course.save after every local write. */
  function touched(key) {
    var m = meta(); m[key] = Date.now(); setMeta(m);
    if (!state.ready) return;
    state.queue[key] = true;
    clearTimeout(state.timer);
    state.timer = setTimeout(flush, 600);
  }

  function flush() {
    if (state.writing) return;
    var keys = Object.keys(state.queue);
    if (!keys.length) return;
    state.writing = true;
    setStatus("saving");
    var key = keys[0];
    delete state.queue[key];
    var raw = null;
    try { raw = localStorage.getItem(key); } catch (e) { raw = null; }
    var body = { k: key, v: raw, t: meta()[key] || Date.now() };
    state.db.doc("data/users/" + state.uid + "/" + docId(key)).set(body).then(function () {
      state.writing = false;
      if (Object.keys(state.queue).length) flush(); else setStatus("synced");
    }, function (err) {
      state.writing = false;
      setStatus(err && err.code === "quota_exceeded" ? "full" : "error");
    });
  }

  /* Pull remote copies; newer remote values replace local ones, newer local values are pushed. */
  function pull() {
    if (!state.ready) return Promise.resolve(false);
    return state.db.collection("data/users/" + state.uid).get().then(function (snap) {
      var m = meta(), changed = false, seen = {};
      snap.docs.forEach(function (d) {
        var b = d.data();
        if (!b || typeof b.k !== "string" || b.k.indexOf("sosnoff.") !== 0) return;
        seen[b.k] = true;
        var localT = m[b.k] || 0;
        if (b.t > localT) {
          try {
            if (b.v === null) localStorage.removeItem(b.k); else localStorage.setItem(b.k, b.v);
          } catch (e) { return; }
          m[b.k] = b.t; changed = true;
        } else if (localT > b.t) {
          state.queue[b.k] = true;
        }
      });
      Object.keys(m).forEach(function (k) { if (!seen[k]) state.queue[k] = true; });
      setMeta(m);
      setStatus("synced");
      flush();
      return changed;
    });
  }

  function init() {
    if (!window.claude || typeof window.claude.use !== "function") { setStatus("local"); return Promise.resolve(false); }
    setStatus("connecting");
    return Promise.all([window.claude.use("db"), window.claude.use("user")]).then(function (r) {
      var db = r[0], user = r[1];
      if (!db || !user) { setStatus("local"); return false; }
      return user.id().then(function (uid) {
        if (!uid) { setStatus("local"); return false; }
        state.db = db; state.uid = uid; state.ready = true;
        // Adopt keys written before sync existed on this device.
        var m = meta();
        try {
          for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            if (k && k.indexOf("sosnoff.") === 0 && k !== META && !m[k]) m[k] = 1;
          }
        } catch (e) { /* storage unavailable */ }
        setMeta(m);
        return pull();
      });
    }).catch(function () { setStatus("error"); return false; });
  }

  window.Sync = {
    init: init,
    pull: pull,
    touched: touched,
    status: function () { return state.status; },
    onStatus: function (fn) { listeners.push(fn); fn(state.status); }
  };
})();
