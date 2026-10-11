# Module 12 — Account & Rules

> **Educational only — not personalized financial advice.** Broker and regulatory details change — confirm with Schwab and FINRA before acting. Facts below were checked against FINRA and Schwab pages in October 2026 (via search results; see the notes on what could not be opened directly).

## Lesson

### Schwab options approval levels

Schwab uses four levels, each including everything below it ([Schwab option approval levels](https://help.streetsmart.schwab.com/pro/4.36/Content/Option_Approval_Levels.htm); [Schwab options application form](https://www.schwab.com/public/file/P-1038697)):

| Level | Name | Examples of what it allows |
|---|---|---|
| 0 | Covered | Covered calls, covered puts, buy-writes; Schwab's form also lists protective puts, collars and cash-secured equity puts |
| 1 | Long | Buying calls and puts, long straddles/strangles |
| 2 | Spreads | Vertical and diagonal spreads (and combinations of verticals such as iron condors) — **requires a margin account** |
| 3 | Uncovered | Naked calls and puts, short straddles/strangles, jade lizards |

[[unverified]] Exact strategy lists per level — the most detailed Schwab page found is an older help-center page; confirm against the current options application in your Schwab account.

**Your status:** Level 2 pending. **Until approved, practice only in paperMoney.** Jade lizards and strangles need Level 3 and are concept-only in this course.

### Why spreads require margin

A spread's short leg is an obligation; the long leg covers it, but only as a *position*, not as cash. Schwab therefore requires spreads to be held in a margin account and holds the spread's max risk as a requirement (buying-power reduction) ([Schwab — vertical spreads](https://www.schwab.com/learn/story/how-could-vertical-spreads-help-your-strategy)). You don't borrow to place a defined-risk spread, but the account type must allow the structure.

### The $2,000 margin minimum

Schwab requires at least **$2,000** in cash or marginable securities to use margin ([Schwab margin requirements](https://www.schwab.com/margin/margin-rates-and-requirements)). This mirrors the $2,000 minimum equity requirement in FINRA Rule 4210 [[unverified]] (whether the 2026 amendments changed it — confirm in the rule text). With ~$3,000 of equity, your **−$300 stop keeps you well above $2,000** — another reason the stop exists. [[adapt]]

### The 2026 FINRA Rule 4210 change

- **What changed:** The SEC approved amendments to FINRA Rule 4210 that **eliminate the "pattern day trader" designation and its $25,000 minimum equity requirement**, replacing the old day-trading margin rules with an **intraday margin** standard ([FINRA Regulatory Notice 26-10](https://www.finra.org/rules-guidance/notices/26-10); [FINRA — Understanding the New Intraday Margin Requirements](https://www.finra.org/investors/insights/intraday-margin-requirements)).
- **Dates:** Notice 26-10 was published **April 20, 2026**; the amendments became effective **June 4, 2026**. Firms that need more time may phase in implementation until **October 20, 2027**.
- **How it works now:** Firms must determine an **intraday margin deficit** for margin accounts on days with margin-reducing trades. Per FINRA's notice, an unmet deficit can stay outstanding until satisfied or until the 15th business day; customers who repeatedly fail to meet deficits can face a **90-day restriction** on increasing positions or debit balances.
- **At Schwab:** Schwab says it stopped counting day trades on **June 8, 2026**, removed PDT flags from accounts under $25,000, and chose **real-time** intraday margin monitoring — it may block trades that would create or increase an intraday deficit. Schwab announced **Intraday Margin Buying Power** for eligible margin accounts with at least $2,000 ([Schwab — Updates Day Trading and Margin Rules](https://www.schwab.com/learn/story/schwab-changes-rules-around-day-trading); [Schwab — SEC Approves Scrapping $25,000 Day Trader Minimum](https://www.schwab.com/learn/story/sec-approves-scrapping-25000-day-trader-minimum)). The launch date (stated as July 13, 2026) was not confirmed as completed [[unverified]].
- **Reg T still applies** to overnight positions.

**What it means for you:** the old 3-day-trades-in-5-days limit is gone, so 0DTE Format A no longer risks a PDT flag. That makes over-trading *easier*, not safer. Your own rules — one trade per week on the main track, one 0DTE per day max, lockout, −$300 stop — now do the job the PDT rule used to do by accident. [[adapt]]

### Your account rules (summary)

| Rule | Value |
|---|---|
| Account | Schwab margin, ~$3,000 equity, thinkorswim |
| Approval | Level 2 pending → paperMoney until approved |
| Max risk per trade | $100 defined, 1 contract |
| Max open | 2–3 positions, ≤ $300 total open risk |
| Stop | −$300 total → back to paperMoney |
| Lockout | 24 h after 2 consecutive losses |
| Session | Each session starts at $0 P&L |
| Earnings | Never hold through earnings |

Build your printable version in the [rulebook builder](rulebook.html).

## Worked example (illustrative, sized to the $100 limit)

Your account has $3,000 equity [[illus]]. You hold two 45-DTE put spreads ($78 and $75 max loss) and consider a third at $80.

- Buying power used ≈ $78 + $75 + $80 = **$233** (defined-risk spreads typically reserve their max loss).
- Total open risk $233 ≤ $300 ✅. Open positions 3 ≤ 3 ✅.
- Worst case if all three hit max loss: equity ≈ $2,767 — still above the $2,000 margin minimum ✅, and the −$300 stop would not yet trigger (−$233).
- A fourth trade would break the max-open rule even though buying power allows it. **Buying power is not permission.**

## What would break this trade

- **Placing a spread before Level 2 approval** — the order is rejected (or worse, you try a workaround structure you don't understand).
- **Equity falling toward $2,000** — margin features, including spreads, can be restricted.
- **Intraday margin deficits** from careless 0DTE trading — with real-time monitoring, Schwab may block trades.
- **Rules changing again** — re-check FINRA and Schwab pages before relying on this module.

## Sources

- FINRA, Regulatory Notice 26-10: <https://www.finra.org/rules-guidance/notices/26-10>
- FINRA, Understanding the New Intraday Margin Requirements: <https://www.finra.org/investors/insights/intraday-margin-requirements>
- Schwab, Schwab Updates Day Trading and Margin Rules: <https://www.schwab.com/learn/story/schwab-changes-rules-around-day-trading>
- Schwab, SEC Approves Scrapping $25,000 Day Trader Minimum: <https://www.schwab.com/learn/story/sec-approves-scrapping-25000-day-trader-minimum>
- Schwab, Margin Requirements & Interest Rates: <https://www.schwab.com/margin/margin-rates-and-requirements>
- Schwab, Option Approval Levels (help center): <https://help.streetsmart.schwab.com/pro/4.36/Content/Option_Approval_Levels.htm>
- Schwab, How Can Vertical Spreads Help Your Strategy?: <https://www.schwab.com/learn/story/how-could-vertical-spreads-help-your-strategy>

## Quiz

```quiz
[
 {"q":"Which Schwab approval level is needed for vertical spreads?","options":["Level 0","Level 1","Level 2","Level 3"],"answer":2,"explain":"Level 2 (Spreads), held in a margin account."},
 {"q":"As of the 2026 FINRA Rule 4210 amendments, what happened to the $25,000 pattern day trader minimum?","options":["Raised to $50,000","Eliminated and replaced with intraday margin standards","Unchanged","Applies only to options"],"answer":1,"explain":"Effective June 4, 2026 (Notice 26-10), with firm phase-in allowed until Oct 20, 2027."},
 {"q":"What minimum does Schwab require to use margin?","options":["$500","$2,000","$25,000","$125,000"],"answer":1,"explain":"$2,000 in cash or marginable securities ($125,000 is for portfolio margin)."},
 {"q":"You have buying power for a 4th spread. Can you open it?","options":["Yes, buying power allows it","No — your rule caps open positions at 3","Yes, if it is 0DTE","Yes, if IV rank is high"],"answer":1,"explain":"Buying power is not permission. Your rulebook caps open positions."},
 {"q":"How does Schwab monitor intraday margin under the new rules?","options":["Only at month end","In real time, and may block trades that create deficits","It doesn't","Only for accounts over $25,000"],"answer":1,"explain":"Schwab chose real-time monitoring and may block trades that would create or increase an intraday deficit."}
]
```
