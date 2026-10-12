/* Course home: module map with quiz progress and the next-step card. */
(function () {
    var C = window.Course;
    var trackLabel = { main: '<span class="badge main">Main</span>', lab: '<span class="badge lab">Lab</span>', compare: "Compare", account: "Account" };
    var tbody = document.querySelector("#module-table tbody");
    var done = 0;
    C.MODULES.forEach(function (m) {
      var s = window.Quiz.getScore("module-" + m.id);
      if (s) done++;
      var pill = s ? '<span class="progress-pill' + (s.best === s.total ? " done" : "") + '">best ' + s.best + "/" + s.total + "</span>" : '<span class="muted small">not taken</span>';
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + m.id + '</td><td><a href="' + C.moduleHref(m.id) + '\">' + C.esc(m.title) + "</a></td><td>" + trackLabel[m.track] + "</td><td>" + pill + "</td>";
      tbody.appendChild(tr);
    });
    var pl = C.load(C.KEYS.placement, null);
    var next = document.getElementById("next-step");
    if (!pl) {
      next.innerHTML = "<h3>Start here</h3><p>Take the 15-question <a href=\"placement.html\">placement quiz</a>. It shows which modules to focus on. Then work through Module 01 onward — the main track first.</p>" +
        '<a class="btn" href="placement.html">Take the placement quiz</a>';
    } else {
      var rec = pl.recommend || "01";
      var mod = C.MODULES.filter(function (m) { return m.id === rec; })[0] || C.MODULES[0];
      next.innerHTML = "<h3>Your next step</h3><p>Placement score " + pl.score + "/" + pl.total + ". Suggested starting point: <strong>Module " + mod.id + " — " + C.esc(mod.title) + "</strong>. Quizzes taken: " + done + " of " + C.MODULES.length + ".</p>" +
        '<div class="actions"><a class="btn" href="' + C.moduleHref(mod.id) + '\">Go to Module ' + mod.id + '</a><a class="btn secondary" href="placement.html">Retake placement</a></div>';
    }
    C.armConfirm(document.getElementById("reset-progress"), function () {
      C.MODULES.forEach(function (m) { C.save(C.KEYS.quizPrefix + "module-" + m.id, null); });
      C.save(C.KEYS.quizPrefix + "placement", null);
      C.save(C.KEYS.placement, null);
      if (window.Shell) window.Shell.render(); else location.reload();
    });
})();
