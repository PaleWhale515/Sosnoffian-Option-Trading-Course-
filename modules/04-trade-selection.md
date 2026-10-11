# Module 04 — Trade Selection

> **Educational only — not personalized financial advice.** Worked-example numbers are illustrative, not market quotes. Track: [[main]]

## Lesson

Trade selection is a filter, not a forecast. You are not predicting where a stock goes; you are choosing underlyings where the premium is rich, the market is liquid, and nothing scheduled is likely to blow through your strikes.

### Index ETFs (start here)

| Underlying | Style / settlement | Why it fits | Watch out for |
|---|---|---|---|
| **SPY** (S&P 500 ETF) | American, physical shares | Deepest liquidity, $1 strikes | Assignment = 100 shares (~$60k); ex-dividend dates on short calls |
| **QQQ** (Nasdaq-100 ETF) | American, physical | Very liquid, higher IV than SPY | Tech-concentrated moves |
| **IWM** (Russell 2000 ETF) | American, physical | Liquid, higher IV, lower share price | Small-cap gaps |
| **XSP** (Mini-SPX index) | European, cash-settled ([Cboe](https://www.cboe.com/tradable_products/sp_500/mini_spx_options/specifications)) | No early assignment, no share delivery | Wider bid/ask, lower volume than SPY |

Broad index products are closest to the instruments tastylive studied, so the research applies most directly here. [[tasty]] [[adapt]]

### Single stocks (only when they pass every filter)

1. **Liquid options.** Tight bid/ask on the strikes you want — as a course rule, about $0.05 or less per leg near the money — and open interest in the thousands on those strikes. [[adapt]] (These thresholds are course rules of thumb, not a sourced standard.)
2. **Elevated IV rank** — at or above your rulebook minimum (default 30). [[tasty]] [[unverified]] threshold; see Module 02.
3. **$1-wide strikes available** at ~45 DTE so a spread fits the $100 limit. Many stocks only have $2.50 or $5 strikes in monthly expirations — those fail the rule.
4. **No earnings before your exit** (below).

Applying 45-DTE management rules to single stocks is a course adaptation; single names carry idiosyncratic jump risk that index studies do not capture. [[adapt]]

### THE EARNINGS RULE

**Never hold a position through an earnings announcement. Check the date before entry.** [[adapt]]

- Earnings are the most common reason a single stock's IV rank is high. That IV is event risk, not a durable premium.
- An earnings gap can jump from above your short strike to below your long strike overnight — max loss with no chance to react.
- Your exit is at 21 DTE at the latest, so the rule in practice: **if earnings fall on or before your 21-DTE date, skip the trade.** The [trade ticket](ticket.html) warns you when this happens.
- In thinkorswim, upcoming earnings are typically marked on the chart and in the Trade tab [[unverified]] (layout varies by version). Confirm the date on the company's investor-relations page; companies sometimes announce dates late.

ETFs (SPY, QQQ, IWM) and XSP have no earnings dates, but scheduled macro events (FOMC, CPI, jobs report) still move them. These are not banned here — just know they are on the calendar. [[adapt]]

### The selection checklist

- [ ] Underlying is SPY / QQQ / IWM / XSP, or a single stock passing all four filters
- [ ] IV rank ≥ rulebook minimum (note IVR vs. IVP in the journal)
- [ ] Expiration ~45 DTE (35–55 acceptable) [[sosnoff]]
- [ ] $1-wide strikes; max loss ≤ $100
- [ ] Bid/ask on each leg tight; fill at or near the mid
- [ ] No earnings on or before the 21-DTE date

## Worked example (illustrative, sized to the $100 limit)

It is a Tuesday morning, 8:45 AM CT. Your watchlist shows [[illus]]:

| Candidate | IV rank | Strikes at 45 DTE | Earnings | Verdict |
|---|---|---|---|---|
| IWM | 38 | $1 wide | None | ✅ Passes |
| Stock ABC | 62 | $1 wide | In 18 days (before 21-DTE date) | ❌ Earnings rule |
| Stock DEF | 45 | $5 wide only | In 70 days | ❌ Can't fit $100 |
| SPY | 14 | $1 wide | None | ❌ IV rank too low |

You choose IWM: sell a 45-DTE $1-wide put vertical ~20-delta short strike for about $0.22 credit → max profit $22, max loss $78.

## What would break this trade

- **Earnings or news you missed** (date moved, pre-announcement, guidance cut).
- **Illiquid fills** — paying $0.10 of slippage on a $0.22 credit erases almost half the trade.
- **Correlation** — two "different" trades in SPY and QQQ are largely the same bet. A broad selloff hits both.
- **Assignment logistics** on SPY/QQQ/IWM if you are careless near expiration — the routine closes at 21 DTE to avoid this.

## Sources

- Cboe, XSP specifications: <https://www.cboe.com/tradable_products/sp_500/mini_spx_options/specifications>
- The Investors Podcast, MI079 with Tom Sosnoff (45 DTE "sweet spot", ~20 delta): <https://www.theinvestorspodcast.com/millennial-investing/options-trading-tom-sosnoff/>

## Quiz

```quiz
[
 {"q":"Your 21-DTE close date is Nov 20. The stock reports earnings Nov 14. What do you do?","options":["Enter, it's fine","Skip the trade — earnings fall before your 21-DTE exit","Enter with 2 contracts","Enter and stop out before earnings"],"answer":1,"explain":"Never hold through earnings. If earnings land on or before the 21-DTE date, the trade is skipped."},
 {"q":"Stock DEF only has $5-wide strikes. Why does it fail?","options":["IV is too low","A $5-wide spread's max loss is far above $100 at 1 contract","It has no options","It is European style"],"answer":1,"explain":"Max loss = width − credit. A $5-wide spread risks up to $500 minus the credit."},
 {"q":"Which underlying has no early-assignment risk?","options":["SPY","IWM","XSP","QQQ"],"answer":2,"explain":"XSP is European-style and cash-settled."},
 {"q":"Why are SPY and QQQ trades not truly diversified?","options":["They trade at different times","They are highly correlated broad-market bets","QQQ has no options","SPY is cash-settled"],"answer":1,"explain":"Both move with the broad U.S. stock market, so a selloff tends to hit both at once."}
]
```
