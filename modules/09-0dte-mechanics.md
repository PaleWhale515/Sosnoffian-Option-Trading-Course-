# Module 09 — 0DTE Mechanics

> **Educational only — not personalized financial advice.** Worked-example numbers are illustrative, not market quotes. Track: [[lab]] — 0DTE Lab.

## Lesson

0DTE ("zero days to expiration") options expire the same day you trade them. Everything that is slow at 45 DTE is fast here.

### Gamma: why 0DTE feels like a different instrument

Gamma — how fast delta changes — is highest for at-the-money options near expiration. On expiration day, a strike that was "safely" out of the money at 9:00 AM can be in the money by noon, and a $1-wide spread can go from $0.20 to $0.90 in minutes. For a short spread, that is **negative gamma**: the position gets worse faster the further it moves against you. [[adapt]]

At 45 DTE, a 1% move changes your spread a little. At 0DTE, the same move can take it to max loss.

### Pin risk and after-hours exercise (SPY)

SPY options are **American-style and settle in shares**.

- Expiring SPY options stop trading at **4:00 PM ET (3:00 PM CT)** on expiration day. [[unverified]] (standard for ETF options; confirm on your broker's expiration-day rules page).
- But **exercise decisions can be made after the close**, while SPY still trades after hours. Sources vary on the exact cutoff (roughly 5:30 PM ET is commonly cited). [[unverified]]
- **Pin risk:** if SPY closes right at your short strike, you cannot know whether you will be assigned. An after-hours move can make the holder exercise — leaving you with 100 shares (≈$60,000 of SPY) in a ~$3,000 account, on a Monday open you don't control.
- **The fix:** never carry a short SPY 0DTE leg near the money into the close. Format A in Module 10 closes by 10:00 AM CT for exactly this reason. [[adapt]]

### XSP: European, cash-settled, 1/10 SPX

Per Cboe's XSP specifications ([Cboe](https://www.cboe.com/tradable_products/sp_500/mini_spx_options/specifications)):

- **Size:** 1/10 of SPX, $100 multiplier — similar notional to SPY.
- **Exercise:** European — generally exercisable only at expiration. **No early assignment.**
- **Settlement:** **Cash**, based on one-tenth of the S&P 500's official closing value (PM-settled) for standard, weekly and end-of-month series. No shares are delivered.
- **Last trade:** expiring XSP options stop trading at 4:00 PM ET on expiration day.
- **Liquidity:** XSP trades far less than SPY, so bid/ask spreads are typically **wider** — you may pay more to get in and out. [[adapt]]

| | SPY | XSP |
|---|---|---|
| Exercise | American | European |
| Settlement | 100 shares | Cash |
| Early assignment risk | Yes | No |
| Pin / after-hours risk | Yes | Settles to official close; no share risk |
| Liquidity | Very high | Lower; wider spreads |
| Fit for "enter and leave alone" | Poor if held to close | Better, but max loss is still real |

### Settlement and timing summary

- Your trading window is **8:30–10:00 AM CT** (9:30–11:00 AM ET) — the first 90 minutes of the session, typically the most volatile part of the day. [[adapt]]
- A 0DTE position opened then has **~5–6 hours** of exposure if left alone.

### Approval and margin

0DTE spreads need the same **Level 2 (Spreads)** approval and **margin account** as any vertical. Since June 4, 2026, FINRA's pattern day trader rule no longer applies; firms now monitor **intraday margin** instead (Module 12). Opening and closing the same day is no longer counted toward a PDT flag at Schwab, but intraday margin deficits can still restrict you. Your own rules (24-hour lockout, sessions start at $0, −$300 stop) still apply.

## Worked example (illustrative, sized to the $100 limit)

9:20 AM CT. XSP at $600.00 and SPY at $600.00 (illustrative parity). You compare a $596/$595 0DTE put spread on each [[illus]]:

| | SPY | XSP |
|---|---|---|
| Mid price | $0.20 | $0.20 |
| Bid/ask on the spread | $0.18 / $0.22 | $0.15 / $0.25 |
| Fill if you pay half the spread | $0.20 | $0.20 |
| Fill at the natural (worst) price | $0.18 | $0.15 |
| Max loss at a $0.18 / $0.15 fill | $82 | $85 |
| Assignment risk if held to close | Yes (shares) | No (cash) |

XSP removes share risk; SPY gives better fills. Either way, max loss is under $100.

```payoff
{"structure":"0dte-short-put-vertical","caption":"0DTE $1-wide put spread. The expiration graph is the same shape as at 45 DTE — gamma just gets you there in hours."}
```

## What would break this trade

- **A gap-and-go morning** that runs through your short strike before 10:00 AM CT.
- **Holding a short SPY leg near the money into the close** — pin and after-hours assignment.
- **XSP fills** at the natural price eating a third of the credit.
- **Fees** — $2.60 round trip on a $20 credit (Module 10).

## Sources

- Cboe, XSP specifications: <https://www.cboe.com/tradable_products/sp_500/mini_spx_options/specifications>
- FINRA, Regulatory Notice 26-10: <https://www.finra.org/rules-guidance/notices/26-10>
- Schwab, Schwab Updates Day Trading and Margin Rules: <https://www.schwab.com/learn/story/schwab-changes-rules-around-day-trading>

## Quiz

```quiz
[
 {"q":"Why can a 0DTE spread go from $0.20 to $0.90 in minutes?","options":["Low gamma","Very high gamma near expiration","Theta is zero","Vega is huge on 0DTE"],"answer":1,"explain":"Gamma peaks near the money at expiration, so delta — and your P&L — change very quickly."},
 {"q":"What is pin risk on a short SPY option?","options":["The risk the option is too cheap","Uncertainty about assignment when SPY closes near your short strike, including after-hours moves","The risk of cash settlement","A fee charged by Schwab"],"answer":1,"explain":"Exercise decisions can be made after the close. If SPY closes near your strike, you may or may not be assigned shares."},
 {"q":"Which is true of XSP?","options":["American-style, share-settled","European-style, cash-settled, 1/10 SPX","Same liquidity as SPY","Can be assigned early"],"answer":1,"explain":"Per Cboe: European exercise, cash settlement, 1/10 the size of SPX."},
 {"q":"Trade-off of XSP vs. SPY for 0DTE?","options":["XSP has better fills and share risk","XSP removes assignment/share risk but usually has wider bid/ask spreads","They are identical","SPY is cash-settled"],"answer":1,"explain":"No share delivery with XSP, but lower liquidity usually means worse fills."}
]
```
