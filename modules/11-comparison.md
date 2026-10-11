# Module 11 — Comparison: 0DTE Long vs. 0DTE Short Spreads vs. 45-DTE Short Spreads

> **Educational only — not personalized financial advice.** Worked-example numbers are illustrative, not market quotes. Labels: 45 DTE = [[main]] · 0DTE = [[lab]]

## Lesson

This module compares the three approaches using **sourced statistics only**. Where no verified statistic exists, the table says so instead of filling the gap with a guess. Structural facts (what a structure can and cannot do by definition) are labeled as such.

### The comparison table

| | 0DTE long OTM options | 0DTE short spreads [[lab]] | 45-DTE short spreads [[main]] |
|---|---|---|---|
| **Win rate** | No verified figure for individual traders. In aggregate, retail SPX 0DTE traders lost money (Beckmeyer et al. 2023) [[unverified]] figures | No verified statistic found | No verified statistic for $1-wide spreads. tastylive reports high win rates for managed strangles/condors in its studies [[tasty]]; specific figures [[unverified]] |
| **Average win / loss** | Structure: small fixed loss (the debit), occasional large win | Structure: small win (credit), larger defined loss | Structure: small win (≈50% of credit), loss usually below max if closed at 21 DTE [[tasty]] (direction of effect; size [[unverified]]) |
| **Expectancy** | Negative in aggregate for retail SPX 0DTE per the study [[unverified]] (confirm figures on SSRN) | No verified statistic found | No verified statistic for this exact routine; must be measured in your journal |
| **Typical time in trade** | Minutes to hours | Format A: ≤1 hour; Format B: up to ~6 hours | Until 50% target (tastylive: ~23 days average [[unverified]]) or 21 DTE (max ~24 days) |
| **Screen time** | High — needs watching | Format A: 90 min window; Format B: setup only, but full-day exposure | ~10 min entry once a week + one morning glance [[adapt]] |
| **Fit for a working professional** | Poor | Format A fits the window; Format B fits but carries gamma risk unattended [[adapt]] | Best fit — designed for set-and-forget [[adapt]] |
| **Fee drag at $1-wide size** | ~$1.30 round trip per contract on a ~$20 debit | ~$2.60 round trip vs. ~$20 credit | ~$2.60 round trip vs. ~$20 credit (~$1.30 if left to expire worthless) |
| **Label** | Not in this plan | **Lab / higher variance** | **Main / recommended** |

### How to read this honestly

- The **only** peer-reviewed-style evidence in the table is the Beckmeyer, Branger & Gayda working paper — and it is about **SPX**, in **aggregate**, for **retail**. [[unverified]] for exact figures until checked on SSRN.
- tastylive's studies are **backtests by a company that sells trading education and has brokerage affiliations**. They are still useful and transparent about mechanics, but they are not independent replications. [[tasty]]
- For 0DTE short spreads, this course found **no verified statistic** for win rate, average win/loss, or expectancy at retail size. Marketing claims exist; none are used here.
- The real numbers for **your** routine will come from your [journal](journal.html) and [scorecard](scorecard.html). That is why every trade gets logged with its track.

### Why 45 DTE is labeled "main / recommended"

Not because a statistic proves it wins for you, but because:

1. It is the approach with the most published research behind its **management rules** (50% target, 21-DTE exit, no stops on defined risk) [[tasty]], and it is the timeframe Sosnoff describes as the sweet spot [[sosnoff]].
2. It **fits your schedule** without screen time. [[adapt]]
3. It produces **more decay per dollar of fees** than a 30-minute 0DTE hold (Module 10). [[adapt]]
4. It **directly replaces** the behavior that has been losing you money (Module 08). [[adapt]]

### Why 0DTE is "lab / higher variance"

Gamma risk, fee drag relative to decay in a short hold, and the absence of verified statistics. It is allowed as a separately tracked experiment — not as the plan. [[adapt]]

## Worked example (illustrative, sized to the $100 limit)

Same $100 risk budget, three ways [[illus]]:

| | 0DTE long call | 0DTE put spread (Format A) | 45-DTE put spread |
|---|---|---|---|
| Cost / credit | $20 debit | $20 credit | $22 credit |
| Max loss | $20 | $80 | $78 |
| Max gain | Unlimited (realistically small odds of large) | $20 | $22 (target $11) |
| Breakeven win rate if held to expiry, no fees | Depends on payoff size | 80% | 78% |
| Minutes of attention | All day | 60 | ~10 per week + morning glance |

The table cannot tell you which earns money — only your logged results can. It can tell you which one you can actually follow with a full-time job.

## What would break this trade

- **Treating this comparison as proof.** It is a framework; the statistics column is mostly "not verified."
- **Mixing tracks in the journal** so neither track's results are readable.
- **Letting the lab become the main track** after a few lucky 0DTE days (small-sample bias, Module 06).

## Sources

- Beckmeyer, Branger & Gayda (2023): <https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4404704>
- tastylive, Managing Losers in Risk Defined Strategies (10-24-2016): <https://tastylive.com/shows/market-measures/episodes/managing-losers-in-risk-defined-strategies-10-24-2016>
- tastylive, Taking Profits (08-16-2016): <https://tastylive.com/shows/options-jive/episodes/taking-profits-08-16-2016>
- The Investors Podcast, MI079 with Tom Sosnoff: <https://www.theinvestorspodcast.com/millennial-investing/options-trading-tom-sosnoff/>
- Schwab pricing: <https://www.schwab.com/pricing>

## Quiz

```quiz
[
 {"q":"Which approach is labeled main / recommended in this course?","options":["0DTE long options","0DTE short spreads","45-DTE short spreads","None"],"answer":2,"explain":"45-DTE defined-risk spreads are the main track; 0DTE is the lab."},
 {"q":"Why does the table say ‘no verified statistic’ for 0DTE short-spread win rates?","options":["Because they always lose","Because the course found no verified source and does not invent numbers","Because they always win","Because 0DTE is illegal"],"answer":1,"explain":"Attribution rule: no invented statistics. Missing data is labeled as missing."},
 {"q":"What is a key limitation of tastylive's studies?","options":["They don't exist","They are company backtests, mostly on strangles/condors in SPY/SPX, not independent replications","They only cover 0DTE","They are peer-reviewed and final"],"answer":1,"explain":"Useful and specific, but not independent, and mostly on different structures than $1-wide spreads."},
 {"q":"Where will your own win rate and expectancy come from?","options":["This module's table","Your journal and scorecard","A broker's marketing page","Social media"],"answer":1,"explain":"Log every trade with its track; the scorecard computes your real numbers."}
]
```
