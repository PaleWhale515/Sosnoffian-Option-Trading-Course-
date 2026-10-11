# Module 07 — Winning-Rate Math

> **Educational only — not personalized financial advice.** Worked-example numbers are illustrative, not market quotes. Track: [[main]]

## Lesson

A high win rate is not the goal. A win rate **above breakeven** is the goal. This module gives you the one formula you need and shows how profit-taking changes it.

### The formula

You break even when total wins equal total losses:

**p × W = (1 − p) × L  →  breakeven win rate p = L ÷ (W + L)**

where W = average win and L = average loss (as a positive number).

### Case 1 — $20 credit, $80 risk, held to expiration

- W = $20 (keep all the credit), L = $80 (max loss).
- Breakeven win rate = 80 ÷ (20 + 80) = **80%**.

You need to win 4 trades out of 5 just to break even — before fees.

### Case 2 — same trade, 50% profit-taking, losers still at max loss

- W = $10 (half the credit), L = $80.
- Breakeven = 80 ÷ (10 + 80) = **88.9%**.

Taking profits at 50% **raises** the required win rate *if nothing else changes*. That surprises people. Profit-taking only helps if it also:

1. **raises your actual win rate** (you lock in winners before they can turn into losers), and/or
2. **shrinks your average loss** (the 21-DTE exit closes most losers before they reach max loss), and
3. **frees capital sooner**, so the same dollars produce more occurrences.

tastylive's research claims managing winners and exiting at 21 DTE improved results in their samples [[tasty]] (see Module 05 links; specific win-rate figures not verified here [[unverified]]).

### Case 3 — 50% profit-taking plus the 21-DTE exit

If the 21-DTE exit means your *average* loser is $40 instead of $80 [[illus]] (an assumption — your journal will tell you the real number):

- Breakeven = 40 ÷ (10 + 40) = **80%**.
- If the average loser is $30: 30 ÷ (10 + 30) = **75%**.

### Case 4 — add fees

At $0.65 per contract per leg ([Schwab pricing](https://www.schwab.com/pricing)), a 2-leg spread costs ~$1.30 to open and ~$1.30 to close.

| Scenario | Avg win (net) | Avg loss (net) | Breakeven win rate |
|---|---:|---:|---:|
| Hold to expiration, no fees | $20.00 | $80.00 | 80.0% |
| Hold to expiration, fees† | $18.70 | $82.60 | 81.5% |
| 50% target, losers at max, no fees | $10.00 | $80.00 | 88.9% |
| 50% target, losers at max, fees | $7.40 | $82.60 | 91.8% |
| 50% target, avg loser $40, fees | $7.40 | $42.60 | 85.2% |

† Assumes winners expire worthless (no closing fee) and losers are closed. Schwab states per-contract fees are waived on online buy-to-close trades at $0.05 or less [[unverified]] (from a Schwab pricing page found via search; confirm in the current pricing guide).

### What the market is already pricing

Credit ÷ width is a rough market-implied probability that the spread finishes at max loss. A $0.20 credit on a $1 spread implies roughly a 20% chance of max loss — about the same 80% breakeven you just computed. [[adapt]] (This is an approximation that ignores partial losses and the risk-neutral vs. real-world difference.) In other words, **at fair prices there is no edge**; the hoped-for edge comes from implied volatility tending to exceed realized volatility (Module 02) and from disciplined exits. That is why IV rank and fees matter so much.

## Worked example (illustrative, sized to the $100 limit)

You sell a $1-wide spread for $0.20 (W = $20 max, L = $80 max) [[illus]]. After 20 logged trades your journal shows:

- 16 winners averaging +$9.50 (50% target, after fees)
- 4 losers averaging −$41 (21-DTE exits, after fees)

Actual win rate = 16/20 = **80%**. Breakeven with these averages = 41 ÷ (9.50 + 41) = **81.2%**.
Expectancy = 0.80 × 9.50 − 0.20 × 41 = 7.60 − 8.20 = **−$0.60 per trade**.

Even an 80% win rate loses here. The fix is not "win more" by wishing — it is higher credit per dollar of risk (higher IV rank), lower costs, and keeping losers small by honoring the 21-DTE exit. The [trade ticket](ticket.html) shows the breakeven win rate for every trade before you place it.

## What would break this trade

- **Credits too small** relative to width — the required win rate climbs above what the strike's probability supports.
- **Letting losers run past 21 DTE** — average loss creeps toward max loss and breakeven jumps toward 89%+.
- **Ignoring fees** at $10 targets.
- **Small samples** — a few lucky months can hide negative expectancy (Module 06).

## Sources

- Schwab pricing: <https://www.schwab.com/pricing>
- tastylive, Managing Losers in Risk Defined Strategies (10-24-2016): <https://tastylive.com/shows/market-measures/episodes/managing-losers-in-risk-defined-strategies-10-24-2016>
- tastylive, Taking Profits (08-16-2016): <https://tastylive.com/shows/options-jive/episodes/taking-profits-08-16-2016>

## Quiz

```quiz
[
 {"q":"$20 credit, $80 max loss, held to expiration. Breakeven win rate?","options":["20%","50%","80%","88.9%"],"answer":2,"explain":"80 ÷ (20 + 80) = 80%."},
 {"q":"Same trade, but you take profits at 50% and losers still hit max loss. Breakeven win rate?","options":["80%","88.9%","75%","50%"],"answer":1,"explain":"W = $10, L = $80 → 80 ÷ 90 = 88.9%. Profit-taking only helps if it also raises the win rate or shrinks losses."},
 {"q":"With 50% profit-taking (W = $10), what average loss gives an 80% breakeven?","options":["$80","$40","$20","$10"],"answer":1,"explain":"L ÷ (10 + L) = 0.80 → L = $40."},
 {"q":"A $0.25 credit on a $1-wide spread roughly implies what market-priced chance of max loss?","options":["About 25%","About 75%","About 2.5%","About 50%"],"answer":0,"explain":"Credit ÷ width ≈ 0.25 — a rough approximation of the market-implied probability of max loss."},
 {"q":"Win rate 80%, avg win $9.50, avg loss $41. Expectancy?","options":["+$0.60","−$0.60","+$7.60","−$8.20"],"answer":1,"explain":"0.80 × 9.50 − 0.20 × 41 = 7.60 − 8.20 = −$0.60 per trade."}
]
```
