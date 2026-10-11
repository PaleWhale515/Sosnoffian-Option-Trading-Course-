/* Quiz engine: multiple-choice questions with explanations; scores saved in localStorage. */
(function () {
  "use strict";
  var C = window.Course;

  function getScore(id) { return C.load(C.KEYS.quizPrefix + id, null); }

  function recordScore(id, score, total) {
    var prev = getScore(id) || {};
    var rec = {
      score: score,
      total: total,
      date: new Date().toISOString(),
      best: Math.max(score, prev.best || 0),
      attempts: (prev.attempts || 0) + 1
    };
    C.save(C.KEYS.quizPrefix + id, rec);
    return rec;
  }

  /* questions: [{ q, options: [..], answer: index, explain, topic? }] */
  function mount(container, opts) {
    var id = opts.id;
    var qs = opts.questions;
    var name = "quiz-" + id.replace(/[^\w]/g, "_");
    var el = document.createElement("section");
    el.className = "quiz";
    el.setAttribute("aria-label", opts.title || "Quiz");

    var html = "<h3>" + C.esc(opts.title || "Check your understanding") + "</h3>";
    var prev = getScore(id);
    if (prev) {
      html += '<p class="muted small">Last attempt: ' + prev.score + "/" + prev.total + " · best " + prev.best + "/" + prev.total +
        " · attempts " + prev.attempts + "</p>";
    }
    qs.forEach(function (q, qi) {
      html += '<div class="q" data-q="' + qi + '"><div class="q-text">' + (qi + 1) + ". " + window.MD.inline(q.q) + "</div>";
      q.options.forEach(function (o, oi) {
        html += '<label class="opt"><input type="radio" name="' + name + "_" + qi + '" value="' + oi + '"> <span>' +
          window.MD.inline(o) + "</span></label>";
      });
      html += '<div class="explain">' + window.MD.inline(q.explain || "") + "</div></div>";
    });
    html += '<div class="actions"><button type="button" class="grade">Check answers</button>' +
      '<button type="button" class="secondary reset">Reset</button></div><p class="score" aria-live="polite"></p>';
    el.innerHTML = html;
    container.appendChild(el);

    el.querySelector(".grade").addEventListener("click", function () {
      var score = 0;
      var answers = [];
      qs.forEach(function (q, qi) {
        var block = el.querySelector('.q[data-q="' + qi + '"]');
        var picked = block.querySelector("input:checked");
        var val = picked ? +picked.value : -1;
        answers.push(val);
        block.querySelectorAll(".opt").forEach(function (lab, oi) {
          lab.classList.remove("correct", "wrong");
          if (oi === q.answer) lab.classList.add("correct");
          else if (oi === val) lab.classList.add("wrong");
        });
        if (val === q.answer) score++;
      });
      el.classList.add("graded");
      var rec = recordScore(id, score, qs.length);
      el.querySelector(".score").textContent = "Score: " + score + "/" + qs.length + " (best " + rec.best + "/" + qs.length + "). Saved in this browser.";
      if (opts.onDone) opts.onDone(score, qs.length, answers);
    });
    el.querySelector(".reset").addEventListener("click", function () {
      el.classList.remove("graded");
      el.querySelectorAll("input").forEach(function (i) { i.checked = false; });
      el.querySelectorAll(".opt").forEach(function (l) { l.classList.remove("correct", "wrong"); });
      el.querySelector(".score").textContent = "";
    });
    return el;
  }

  window.Quiz = { mount: mount, getScore: getScore };
})();
