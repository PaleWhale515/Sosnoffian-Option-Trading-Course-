# Premium Selling the Sosnoff Way — Set It, Manage It, Repeat

A self-paced, interactive options course built as a static website. Everything runs locally in your browser — no backend, no accounts, no network calls. Progress, quiz scores, settings and the trade journal are stored in your browser's localStorage.

> **Educational only — not personalized financial advice.**

## Open it

- **Easiest:** double-click `index.html`. Everything works from `file://`. Modules load from `js/modules-bundle.js`, which is generated from `modules/*.md`.
- **Or serve the folder** (modules then load straight from the `.md` files):
  ```
  python3 -m http.server 8000
  # open http://localhost:8000
  ```

## What's inside

| Path | What it is |
|---|---|
| `index.html` | Course home: tracks, module map, quiz progress, next step |
| `module.html#mNN` | Renders `modules/NN-*.md` with its quiz and payoff diagrams |
| `modules/*.md` | 12 modules: lesson (< 800 words), illustrative worked example sized to $100, "what would break this trade", sources, 3–5 question quiz |
| `placement.html` | 15-question placement quiz |
| `ticket.html` | Trade ticket: max profit/loss, breakeven, breakeven win rate, 50% GTC price, 21-DTE date, rule warnings, `.ics` reminder, open-position tracking |
| `payoff.html` | Payoff-diagram generator for every structure in Modules 03 and 10 |
| `journal.html` | In-browser trade log with CSV import/export |
| `templates/journal-template.csv` | Spreadsheet template with the journal columns |
| `scorecard.html` | Win rate, average win/loss, expectancy, average days held — per track; lockout and −$300 checks |
| `rulebook.html` | Editable limits → printable one-page rulebook (also feeds the ticket and scorecard) |
| `sources.html` | Every source, what it's used for, and verification status |
| `TODO.md` | Remaining unverified items |

### Modules

Main track (45 DTE, recommended): 01 Fundamentals · 02 Implied volatility · 03 Structures · 04 Trade selection · 05 The routine · 06 Sizing & pacing · 07 Winning-rate math
0DTE lab: 08 Why lotto buying loses · 09 0DTE mechanics · 10 Two workable 0DTE formats
11 Comparison · 12 Account & rules

### Attribution labels

Every principle is labeled **Sosnoff's view** (with link), **tastylive research** (with link), **Course adaptation**, or **Unverified**. Worked-example numbers are labeled **Illustrative**.

## Editing modules

Modules are plain Markdown with two special fenced blocks:

- ` ```quiz ` — a JSON array of `{ "q", "options", "answer" (0-based index), "explain" }`
- ` ```payoff ` — a JSON object `{ "structure": "<key from js/payoff.js>", ...overrides }`

and inline badges `[[sosnoff]] [[tasty]] [[adapt]] [[unverified]] [[illus]] [[main]] [[lab]]`.

After editing, rebuild the bundle (also validates word counts, quiz JSON and required sections):

```
python3 tools/build_bundle.py
```

## Testing

`tools/smoke_test.js` opens every page in headless Chromium over both `file://` and `http://`, fails on any JavaScript error, and exercises the quiz, payoff, ticket (`.ics`), journal (CSV), scorecard and rulebook flows, plus a phone-width layout check:

```
NODE_PATH=$(npm root -g) node tools/smoke_test.js
```

## Your data

Stored only in this browser under `sosnoff.*` localStorage keys. Clearing site data erases it — export the journal as CSV regularly.
