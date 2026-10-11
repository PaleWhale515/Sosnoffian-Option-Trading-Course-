# TODO — Remaining "unverified" items

Course built October 11, 2026. The build environment's network policy blocked direct page loads from finra.org, schwab.com, cboe.com, tastylive.com and ssrn.com, so facts were checked through web-search results that quote those official pages. Facts marked **checked** below were confirmed that way. Everything else is labeled `Unverified` in the lessons and listed here.

## Regulatory & broker (checked via search — re-confirm on the live pages)

- [x] FINRA Rule 4210 amendments: PDT designation and $25,000 minimum eliminated; intraday margin standard. Regulatory Notice 26-10, published Apr 20, 2026; effective **Jun 4, 2026**; phase-in allowed to **Oct 20, 2027**. — <https://www.finra.org/rules-guidance/notices/26-10>
- [x] Schwab stopped counting day trades Jun 8, 2026; real-time intraday margin monitoring. — <https://www.schwab.com/learn/story/schwab-changes-rules-around-day-trading>
- [x] Schwab $2,000 minimum to use margin; spreads require a margin account and Level 2.
- [x] Schwab options pricing $0 + $0.65 per contract.
- [x] Cboe XSP: European, cash-settled, 1/10 SPX, PM-settled, last trade 4:00 PM ET.
- [ ] **Schwab Intraday Margin Buying Power launch (announced for Jul 13, 2026)** — confirm it launched and how it applies to options spreads. (Module 12)
- [ ] **Whether the 2026 amendments changed Rule 4210's $2,000 minimum equity** — read the amended rule text. (Module 12)
- [ ] **Schwab approval-level strategy lists** — the detailed page found is an older help-center page; compare with the current options application in your account. (Module 12)
- [ ] **Schwab fee waiver on buy-to-close ≤ $0.05** and the current option regulatory fee. (Module 07)
- [ ] **Schwab iron condor buying-power treatment** (only the larger side held?) — check the thinkorswim order confirmation. (Module 03)
- [ ] **SPY expiring-option last trade time and the after-hours exercise cutoff** (≈5:30 PM ET commonly cited) — check Schwab's expiration-day rules. (Module 09)
- [ ] **Whether Schwab auto-closes or restricts near-the-money short options on expiration day** — not researched. (Module 09/10)

## thinkorswim specifics

- [ ] Whether the thinkorswim "IV Percentile" field is actually computed like IV rank (third-party claim). (Module 02)
- [ ] IV percentile as a watchlist column; expected-move display on the option chain. (Module 02)
- [ ] Where earnings dates show in your thinkorswim version. (Module 04)
- [ ] "1st trgs OCO" order menu name, and whether stop orders are accepted on multi-leg spreads at Schwab. (Module 10)
- [ ] Trade-ticket order-entry steps (menu names vary by version). (ticket.html)

## Sosnoff / tastylive

- [ ] **Options Jive — Taking Profits (08-16-2016)**: confirm the 50% target result and the **"~23 days average"** figure (taken from the course brief; the episode could not be found by search). — <https://tastylive.com/shows/options-jive/episodes/taking-profits-08-16-2016>
- [ ] **Market Measures — Managing Winners: Exiting Based on Duration (01-26-2016)**: confirm what it studied and found. — <https://tastylive.com/shows/market-measures/episodes/managing-winners-exiting-based-on-duration-01-26-2016>
- [x] Market Measures — Managing Losers in Risk Defined Strategies (10-24-2016): SPY iron condors ~45 DTE, 16Δ/5Δ, since 2005; managing losers underperformed; closing at 21 DTE outperformed (from the episode description).
- [ ] Specific tastylive win-rate figures for managed vs. held trades — none are quoted in the course; add only with a source. (Modules 07, 11)
- [ ] Sosnoff podcast wording (45 DTE "sweet spot", ~20 delta, out at ~21 days) — transcript checked via search, not against the audio. (Module 05)
- [ ] IV rank "> 30 = elevated" threshold in the 2020 tastytrade slides. (Modules 02, 04)

## Academic

- [ ] **Beckmeyer, Branger & Gayda (2023)** — confirm on SSRN: data period, the ~$358K/day aggregate retail loss after May 2022, the >75% 0DTE share, and the role of transaction costs. — <https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4404704> (Modules 08, 11)
- [ ] Carr & Wu (2009), "Variance Risk Premiums," RFS — confirm the DOI link. (Module 02)
- [ ] OCC options disclosure document link. (footer on every page)

## Comparison module data gaps

- [ ] No verified statistics were found for 0DTE short-spread win rate, average win/loss or expectancy at retail size. (Module 11)
- [ ] No verified statistics for $1-wide 45-DTE verticals specifically; the student's own journal is the intended source. (Module 11)

## Course-rule thresholds (adaptations, not sourced)

These are labeled "Course adaptation" in the lessons. Revisit after 30–50 logged trades:

- Bid/ask ≤ ~$0.05 per leg and open interest "in the thousands" (Module 04)
- 35–55 DTE acceptable window (Module 04/ticket)
- Format A timing (enter after ~9:00 CT, flat by 10:00 CT) and Format B stop at 2× credit (Module 10)
- One trade per week, max 3 open, $300 total open risk, −$300 stop (Module 06)

## Possible enhancements

- Market-holiday calendar for the 21-DTE date (currently only weekends are adjusted).
- Before-expiration (time-value) curves on the payoff diagrams.
