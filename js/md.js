/* Minimal Markdown renderer (no dependencies) for the course modules.
   Supports: headings, paragraphs, bold/italic/code, links, ordered/unordered lists,
   task lists, blockquotes, tables, horizontal rules, fenced code blocks.
   Special fenced blocks: ```quiz (JSON array) and ```payoff (JSON object) become widgets.
   Attribution badges: [[sosnoff]] [[tasty]] [[adapt]] [[unverified]] [[illus]] [[main]] [[lab]]. */
(function () {
  "use strict";

  var BADGES = {
    sosnoff: ["sosnoff", "Sosnoff's view"],
    tasty: ["tasty", "tastylive research"],
    adapt: ["adapt", "Course adaptation"],
    unverified: ["unverified", "Unverified"],
    illus: ["illus", "Illustrative"],
    main: ["main", "Main / recommended"],
    lab: ["lab", "Lab / higher variance"]
  };

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function inline(text) {
    var codes = [];
    var s = text.replace(/`([^`]+)`/g, function (_, c) {
      codes.push("<code>" + esc(c) + "</code>");
      return "\u0000" + (codes.length - 1) + "\u0000";
    });
    s = esc(s);
    s = s.replace(/\[\[(\w+)\]\]/g, function (m, k) {
      var b = BADGES[k];
      return b ? '<span class="badge ' + b[0] + '">' + b[1] + "</span>" : m;
    });
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, t, u) {
      var ext = /^https?:/.test(u);
      return '<a href="' + u + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + t + "</a>";
    });
    s = s.replace(/&lt;(https?:\/\/[^\s&]+)&gt;/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^\w*])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>");
    s = s.replace(/(^|[^\w])_([^_\n]+)_(?!\w)/g, "$1<em>$2</em>");
    s = s.replace(/\u0000(\d+)\u0000/g, function (_, i) { return codes[+i]; });
    return s;
  }

  function splitRow(line) {
    var t = line.trim();
    if (t.charAt(0) === "|") t = t.slice(1);
    if (t.charAt(t.length - 1) === "|") t = t.slice(0, -1);
    return t.split("|").map(function (c) { return c.trim(); });
  }

  function render(md) {
    var lines = md.replace(/\r\n?/g, "\n").split("\n");
    var out = [];
    var widgets = [];
    var i = 0;

    function isBlockStart(l) {
      return /^(#{1,6})\s/.test(l) || /^```/.test(l) || /^\s*([-*]|\d+\.)\s+/.test(l) ||
        /^>\s?/.test(l) || /^\s*\|/.test(l) || /^(-{3,}|\*{3,})\s*$/.test(l);
    }

    while (i < lines.length) {
      var line = lines[i];

      if (/^\s*$/.test(line)) { i++; continue; }

      var fence = /^```(\w*)\s*$/.exec(line);
      if (fence) {
        var lang = fence[1];
        var buf = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        if (lang === "quiz" || lang === "payoff") {
          widgets.push({ type: lang, src: buf.join("\n") });
          out.push('<div class="md-widget" data-widget="' + (widgets.length - 1) + '"></div>');
        } else {
          out.push("<pre><code>" + esc(buf.join("\n")) + "</code></pre>");
        }
        continue;
      }

      var h = /^(#{1,6})\s+(.*)$/.exec(line);
      if (h) {
        var lvl = h[1].length;
        var id = h[2].toLowerCase().replace(/<[^>]+>/g, "").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
        out.push("<h" + lvl + ' id="' + id + '">' + inline(h[2]) + "</h" + lvl + ">");
        i++;
        continue;
      }

      if (/^(-{3,}|\*{3,})\s*$/.test(line)) { out.push("<hr>"); i++; continue; }

      if (/^>\s?/.test(line)) {
        var q = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; }
        out.push("<blockquote>" + render(q.join("\n")).html + "</blockquote>");
        continue;
      }

      if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
        var head = splitRow(line);
        var aligns = splitRow(lines[i + 1]).map(function (c) { return /-:$/.test(c) ? "num" : ""; });
        i += 2;
        var rows = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(splitRow(lines[i])); i++; }
        var t = '<div class="table-wrap"><table><thead><tr>' +
          head.map(function (c, k) { return "<th" + (aligns[k] ? ' class="num"' : "") + ">" + inline(c) + "</th>"; }).join("") +
          "</tr></thead><tbody>" +
          rows.map(function (r) {
            return "<tr>" + r.map(function (c, k) { return "<td" + (aligns[k] ? ' class="num"' : "") + ">" + inline(c) + "</td>"; }).join("") + "</tr>";
          }).join("") + "</tbody></table></div>";
        out.push(t);
        continue;
      }

      var li = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(line);
      if (li) {
        var ordered = /\d/.test(li[2]);
        var items = [];
        while (i < lines.length) {
          var m = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(lines[i]);
          if (m && m[1].length < 2) {
            items.push({ text: m[3], sub: [] });
            i++;
          } else if (m && items.length) {
            items[items.length - 1].sub.push(lines[i].replace(/^\s{2,4}/, ""));
            i++;
          } else if (!/^\s*$/.test(lines[i]) && !isBlockStart(lines[i]) && items.length) {
            items[items.length - 1].text += " " + lines[i].trim();
            i++;
          } else {
            break;
          }
        }
        var tag = ordered ? "ol" : "ul";
        var isTask = items.some(function (it) { return /^\[[ xX]\]\s/.test(it.text); });
        out.push("<" + tag + (isTask ? ' class="checklist"' : "") + ">" + items.map(function (it) {
          var txt = it.text;
          var box = "";
          var tm = /^\[([ xX])\]\s+(.*)$/.exec(txt);
          if (tm) { box = '<input type="checkbox" aria-label="done"' + (tm[1] !== " " ? " checked" : "") + "> "; txt = tm[2]; }
          var sub = it.sub.length ? render(it.sub.join("\n")).html : "";
          return "<li>" + box + inline(txt) + sub + "</li>";
        }).join("") + "</" + tag + ">");
        continue;
      }

      var para = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !isBlockStart(lines[i])) { para.push(lines[i].trim()); i++; }
      if (para.length) out.push("<p>" + inline(para.join(" ")) + "</p>");
      else i++;
    }
    return { html: out.join("\n"), widgets: widgets };
  }

  window.MD = { render: render, inline: inline };
})();
