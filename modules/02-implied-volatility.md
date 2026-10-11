# Module 02 — Implied Volatility

> **Educational only — not personalized financial advice.** Worked-example numbers are illustrative, not market quotes. Track: [[main]]

## Lesson

Implied volatility (IV) is the market's price for uncertainty. It is "implied" because it is backed out of option prices: when options are expensive, IV is high.

### IV rank vs. IV percentile

Raw IV (say 35%) means little alone — 35% is high for SPY and low for a biotech. So we compare a stock's IV to its own past year.

- **IV rank (IVR)** = (current IV − 52-week low IV) ÷ (52-week high IV − 52-week low IV). It answers: *where is IV within its range?* One spike in the past year can keep IVR low for months.
- **IV percentile (IVP)** = the percent of days in the past year when IV was *lower* than today. It answers: *how unusual is today?*

Example: IV is 30, the year's range is 20–60. IVR = (30−20)/(60−20) = **25**. If IV was below 30 on 70% of days, IVP = **70**. Same stock, very different reading — know which one your platform shows.

### Where it appears in thinkorswim

Schwab's guide says: enter a symbol, go to the **Trade** tab, and open **Today's Options Statistics** below the option chain to see **IV Percentile** ([Schwab — Using Implied Volatility Percentiles](https://www.schwab.com/learn/story/using-implied-volatility-percentiles)). Some third-party sources say the thinkorswim "IV Percentile" field is actually calculated like IV rank [[unverified]]. Practical rule: use one number consistently and write down which one in your journal. You can also add an IV percentile column to a watchlist [[unverified]] — check the column list in your version of thinkorswim.

tastylive has published thinkScript for IVR and IVP ([tastylive — IV Rank and IV Percentile w/ thinkScript](https://www.tastylive.com/shows/the-skinny-on-options-data-science/episodes/iv-rank-and-iv-percentile-w-thinkscript-11-12-2015)). [[tasty]]

### Expected move

A one-standard-deviation expected move over a period is commonly approximated as:

**Expected move ≈ Price × IV × √(DTE ÷ 365)**

For a $50 stock with 40% IV and 45 DTE: 50 × 0.40 × √(45/365) ≈ 50 × 0.40 × 0.351 ≈ **$7.02**. Under the model, the stock finishes inside $43–$57 roughly 68% of the time. It is a model, not a promise — real returns have fatter tails. thinkorswim also shows an expected-move figure on the option chain for each expiration [[unverified]] (check your version).

### The variance risk premium

Across many studies, index implied volatility has, on average, been *higher* than the volatility that later occurred. That gap is the **variance risk premium (VRP)** — option buyers pay for insurance, sellers collect it ([Carr & Wu, "Variance Risk Premiums," Review of Financial Studies, 2009](https://doi.org/10.1093/rfs/hhn038)). Two cautions:

1. "On average" hides crashes, when realized volatility blows past implied and sellers lose fast.
2. The premium is best documented for broad indexes; single stocks are noisier. [[adapt]]

### Why high IV favors sellers

When IV is high you collect more premium for the same strike distance, or can place strikes farther away for the same credit. Sosnoff and tastylive's stated approach is to sell premium when IV is elevated relative to its own history; tastytrade materials have used IVR above ~30 as the "elevated" line ([tastytrade "From Strategy to Practice" slides, 2020](https://s3.amazonaws.com/tastytradepublicmedia/website/cms/tastytrade_TomSosnoff_India2020.pdf/original/tastytrade_TomSosnoff_India2020.pdf)). [[tasty]] [[unverified]] (the exact threshold was found via search summary; confirm in the slides). High IV can also fall (vega helps a short position) — "IV contraction."

High IV is not free money. IV is high because the market expects bigger moves. You are paid more because the risk is bigger.

## Worked example (illustrative, sized to the $100 limit)

Two stocks, both at $50, both with a 45-DTE $47/$46 put spread [[illus]]:

| | Stock A | Stock B |
|---|---|---|
| IV rank | 12 | 55 |
| Credit for $47/$46 put spread | $0.12 | $0.30 |
| Max profit | $12 | $30 |
| Max loss | $88 | $70 |
| Breakeven win rate (hold to expiration) | 88% | 70% |

Same strikes, same width — Stock B pays 2.5× more and needs a far lower win rate to break even. That is the case for selling when IV rank is elevated. (Breakeven win rate = max loss ÷ (max profit + max loss); see Module 07.)

## What would break this trade

- **IV keeps rising** after entry (e.g., market selloff): the spread's mark goes against you even before strikes are tested.
- **High IV for a reason** — earnings, FDA decision, merger news. That is event risk, not a premium (see the earnings rule in Module 04).
- **Misreading the metric**: treating IV percentile as IV rank (or vice versa) and entering when IV is not actually elevated.
- **Tail moves larger than the expected move** — the 1-SD estimate is exceeded roughly a third of the time by definition.

## Sources

- Schwab, Using Implied Volatility Percentiles: <https://www.schwab.com/learn/story/using-implied-volatility-percentiles>
- tastylive, IV Rank and IV Percentile w/ thinkScript (2015): <https://www.tastylive.com/shows/the-skinny-on-options-data-science/episodes/iv-rank-and-iv-percentile-w-thinkscript-11-12-2015>
- Carr & Wu (2009), Variance Risk Premiums: <https://doi.org/10.1093/rfs/hhn038>
- tastytrade, From Strategy to Practice (2020 slides): <https://s3.amazonaws.com/tastytradepublicmedia/website/cms/tastytrade_TomSosnoff_India2020.pdf/original/tastytrade_TomSosnoff_India2020.pdf>

## Quiz

```quiz
[
 {"q":"IV is 30. The past-year IV range is 20 to 60. What is IV rank?","options":["30","50","25","75"],"answer":2,"explain":"(30 − 20) ÷ (60 − 20) = 10 ÷ 40 = 25."},
 {"q":"IV percentile measures…","options":["Where today's IV sits between the year's high and low","The percent of past-year days with IV below today's IV","The probability of profit","The expected move in dollars"],"answer":1,"explain":"That is the definition of IV percentile. IV rank is the high/low range measure."},
 {"q":"Approximate 1-SD expected move: $100 stock, 20% IV, 45 DTE?","options":["About $3.50","About $7.00","About $20.00","About $0.70"],"answer":1,"explain":"100 × 0.20 × √(45/365) ≈ 100 × 0.20 × 0.351 ≈ $7.02."},
 {"q":"What is the variance risk premium?","options":["The fee brokers charge for options","The tendency of implied volatility to exceed later realized volatility on average","The extra margin needed for spreads","A tax on option sellers"],"answer":1,"explain":"Option buyers have, on average, paid more for volatility than what occurred — sellers collect that premium, with crash risk as the cost."},
 {"q":"Why is high IV not ‘free money’?","options":["Because IV is always wrong","Because high IV usually reflects a real expectation of bigger moves or an event","Because high IV lowers credit","Because you cannot sell when IV is high"],"answer":1,"explain":"You are paid more because the market expects more movement. That is why event risk like earnings is excluded."}
]
```
