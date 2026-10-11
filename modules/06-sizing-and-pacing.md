# Module 06 — Position Sizing & Pacing

> **Educational only — not personalized financial advice.** Worked-example numbers are illustrative, not market quotes. Track: [[main]]

## Lesson

A strategy with a small edge only works if you survive long enough for the edge to show up. Sizing and pacing are how you survive.

### Your limits (editable in the [rulebook](rulebook.html))

| Rule | Default | Label |
|---|---|---|
| Max defined risk per trade | $100, 1 contract | [[adapt]] |
| New trades | One per week | [[adapt]] |
| Max open positions | 2–3 | [[adapt]] |
| Total open risk | ≤ $300 (about 10% of ~$3,000 equity) | [[adapt]] |
| Stop live trading | −$300 total → back to paperMoney | [[adapt]] |
| Lockout | 24 hours after 2 consecutive losses | [[adapt]] (your existing rule) |
| Session P&L | Each session starts at $0 | [[adapt]] (your existing rule) |

### Why "trade small, trade often"

tastylive's "trade small, trade often" argument is the law of large numbers: the more independent occurrences, the closer actual results get to expected probabilities. If each trade is too large, you get fewer occurrences before a bad run ends the experiment ([Options Jive — Theory Behind Trade Small Trade Often](https://www.tastylive.com/shows/options-jive/episodes/theory-behind-trade-small-trade-often-12-14-2015); [Best Practices — The Tenets of tastylive](https://tastylive.com/shows/best-practices/episodes/the-tenets-of-tastylive-07-25-2016)). [[tasty]]

"Often," for you, means **one new trade a week** — not every day. [[adapt]] Here is why that is enough:

### Occurrence math

- One trade per week ≈ **50 occurrences a year**.
- If trades last ~2–3 weeks on average (50% target or 21-DTE exit, whichever first), one entry per week naturally keeps **2–3 positions open** — matching your max. [[adapt]]
- 3 open × up to $100 each = **$300 max open risk**.

### Small samples lie

Suppose your true win rate is 80% (illustrative). Over a small number of trades, the observed win rate swings widely just by chance (±2 standard deviations shown) [[illus]]:

| Trades | Likely observed win-rate range |
|---|---|
| 10 | 55% – 100% |
| 20 | 62% – 98% |
| 50 | 69% – 91% |

Conclusion: do not judge the routine on 10 trades, and do not abandon it after two losses.

### Losing streaks are normal

Your rule: 24-hour lockout after 2 consecutive losses. How often will it trigger? If each trade has a 20% chance of losing (illustrative), the probability of at least one run of 2 losses in a row is about **27% over 10 trades, 49% over 20, and 82% over 50**. At a 30% loss rate: 50%, 77%, 98% [[illus]] (computed with a simple independent-trials model). The lockout *will* fire. Plan for it; it is a cooling-off rule, not a verdict.

### Expectancy

**Expectancy per trade = (win rate × average win) − (loss rate × average loss)**

Expectancy is what you make on average per trade *after* enough occurrences. Multiply by trades per year to see what the routine is worth — and compare to fees.

### The −$300 stop

With ~$3,000 equity and $75–$80 typical max losses, −$300 is about four full losses. Hitting it means something is wrong — the market regime, the rules, or how they are being followed. Back to paperMoney, review the journal's "rule followed" column, then decide. [[adapt]]

## Worked example (illustrative, sized to the $100 limit)

Assume 50 trades in a year, each a $1-wide spread for $0.22 (max profit $22, max loss $78). Managed at 50% (wins +$11) and closed at 21 DTE otherwise. Assume [[illus]]:

- 75% of trades hit the 50% target: +$11 each.
- 25% close at 21 DTE for an average of −$30 each (some small losses, a few near max loss).
- Fees ≈ $2.60 per trade (open + close, two legs, $0.65 each — [Schwab pricing](https://www.schwab.com/pricing)).

Expectancy before fees = 0.75 × $11 − 0.25 × $30 = $8.25 − $7.50 = **+$0.75 per trade**.
After fees: $0.75 − $2.60 = **−$1.85 per trade** → about **−$92 over 50 trades**.

The lesson: at this size, **fees can decide the outcome.** Ways the routine stays positive: larger credits relative to width (higher IV rank), fewer legs, letting far-OTM winners expire rather than paying to close (a 50% target is still the default — but log fee totals to see their weight). These assumptions are not statistics; your journal will produce the real ones.

## What would break this trade

- **Correlated positions**: three put spreads on SPY, QQQ and IWM are close to one large bet.
- **Breaking the pace**: two or three entries in one week after a win ("revenge" or "hot hand").
- **Raising size** after a winning streak before 30–50 occurrences are logged.
- **Ignoring fee drag** on small credits.

## Sources

- tastylive, Theory Behind Trade Small Trade Often (12-14-2015): <https://www.tastylive.com/shows/options-jive/episodes/theory-behind-trade-small-trade-often-12-14-2015>
- tastylive, The Tenets of tastylive (07-25-2016): <https://tastylive.com/shows/best-practices/episodes/the-tenets-of-tastylive-07-25-2016>
- Schwab pricing: <https://www.schwab.com/pricing>

## Quiz

```quiz
[
 {"q":"Three open positions each with $80 max loss. What is total open risk, and is it within the default limit?","options":["$240 — yes","$300 — yes, exactly","$80 — yes","$240 — no"],"answer":0,"explain":"3 × $80 = $240, under the $300 total-open-risk limit."},
 {"q":"Win rate 80%, average win $10, average loss $35. Expectancy per trade before fees?","options":["+$1.00","+$8.00","−$1.00","+$4.50"],"answer":0,"explain":"0.80 × 10 − 0.20 × 35 = 8 − 7 = +$1.00."},
 {"q":"Why not judge the routine after 10 trades?","options":["Because 10 trades is a large sample","Because observed win rates swing widely in small samples","Because the first 10 trades always lose","Because fees are waived after 10 trades"],"answer":1,"explain":"With 10 trades, an 80% true win rate can easily show up as 60% or 100%."},
 {"q":"With a 20% loss rate, about how likely is at least one 2-loss streak over 20 trades?","options":["About 5%","About 20%","About 49%","About 99%"],"answer":2,"explain":"Roughly 49% under an independent-trials model — the lockout rule will trigger regularly."}
]
```
