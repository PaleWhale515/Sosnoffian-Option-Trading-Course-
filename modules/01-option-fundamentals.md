# Module 01 — Option Fundamentals

> **Educational only — not personalized financial advice.** Worked-example numbers are illustrative, not market quotes. Track: [[main]]

## Lesson

You have mostly bought out-of-the-money 0DTE SPY options. This course flips the seat: you will mostly **sell** defined-risk spreads that have time on them. Before that, the vocabulary has to be automatic.

### Calls, puts, and the contract

- A **call** gives the buyer the right to buy 100 shares at the strike price until expiration. A **put** gives the right to sell 100 shares at the strike.
- The seller (writer) takes the other side: an obligation, paid for up front with **premium**.
- One contract usually covers 100 shares, so a quote of $0.25 means $25 per contract.

### Intrinsic and extrinsic value

- **Intrinsic value** is what the option would be worth if exercised right now. A $47 put with the stock at $45 has $2.00 of intrinsic value. A $47 put with the stock at $50 has none — it is out of the money (OTM).
- **Extrinsic value** (time value) is everything else: premium − intrinsic. It reflects time left and implied volatility.
- At expiration extrinsic value is zero. Premium sellers are paid for extrinsic value that melts away — when the stock cooperates.

### The Greeks (what each one means to a premium seller)

| Greek | Measures | Short put spread (typical sign) | What it means for you |
|---|---|---|---|
| Delta | Price change per $1 move in the stock | Positive | You want the stock flat or up |
| Gamma | How fast delta changes | Negative | Risk accelerates as expiration nears — one reason to exit at 21 DTE |
| Theta | Value lost per day from time | Positive | Time decay works for you |
| Vega | Price change per 1-point change in IV | Negative | A rise in IV hurts; a drop helps |

Delta is also a rough, commonly used approximation for the probability an option expires in the money. A 20-delta short put is roughly an 80% chance of expiring OTM — under the model's assumptions, not a guarantee. [[adapt]]

### American vs. European exercise

- **American-style** options (SPY, IWM, QQQ, single stocks) can be exercised any day up to expiration. That means a short leg can be **assigned early**.
- **European-style** options (XSP, SPX) can generally be exercised only at expiration, and index options like XSP settle in **cash**, not shares ([Cboe XSP specs](https://www.cboe.com/tradable_products/sp_500/mini_spx_options/specifications)).

### Assignment — why it matters on a $3,000 account

If your short $47 put is assigned, you buy 100 shares at $47: a $4,700 position in a ~$3,000 account. In a spread, your long $46 put still caps the loss, but you can be left with shares and a margin call until you sell them or exercise the long put. Early assignment is most likely when a short option is deep in the money with little extrinsic value left, and on short calls the day before an ex-dividend date. The 45-DTE routine reduces this risk by closing at 21 DTE, long before the final days when extrinsic value is thinnest. [[adapt]]

### Why selling time instead of buying it

A long OTM option needs a move, in the right direction, soon enough to beat decay. A short OTM spread needs the stock to *not* move too far against you. The seller gives up big wins for a higher probability of small ones — which is exactly why position size and exits (later modules) decide whether that trade-off pays.

## Worked example (illustrative, sized to the $100 limit)

XYZ trades at $50. You sell the 45-DTE $47 put and buy the $46 put for a **$0.25 net credit** [[illus]].

- Credit received: $0.25 × 100 = **$25**.
- Spread width: $47 − $46 = $1.00 → $100 per contract.
- Max loss: ($1.00 − $0.25) × 100 = **$75** — inside the $100 limit.
- Both puts are OTM, so the whole $0.25 is extrinsic value.
- If XYZ is above $47 at expiration, both puts expire worthless and you keep $25 (minus fees).

```payoff
{"structure":"short-put-vertical","spot":50,"longPut":46,"shortPut":47,"premium":0.25,"caption":"A $1-wide short put vertical: small capped gain, capped loss of $75."}
```

## What would break this trade

- **A sharp drop** through $47 before you exit — delta and gamma turn against you.
- **IV spike** (vega): the spread can show a paper loss even if the stock barely moves.
- **Early assignment** on the short $47 put if it goes deep ITM — manageable, but it can create a temporary share position larger than your account.
- **Fees** eating a $25 credit: at $0.65 per contract per leg ([Schwab pricing](https://www.schwab.com/pricing)), opening and closing a 2-leg spread costs about $2.60.

## Sources

- Cboe, XSP product specifications: <https://www.cboe.com/tradable_products/sp_500/mini_spx_options/specifications>
- OCC, Characteristics and Risks of Standardized Options: <https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document>
- Schwab pricing (per-contract fee): <https://www.schwab.com/pricing>

## Quiz

```quiz
[
 {"q":"XYZ is at $50. A $47 put is quoted at $0.40. How much of that is extrinsic value?","options":["$0.00","$0.40","$3.00","$2.60"],"answer":1,"explain":"The $47 put is out of the money with the stock at $50, so intrinsic value is $0 and all $0.40 is extrinsic (time) value."},
 {"q":"Which Greek is typically **negative** for a short put vertical and grows as expiration approaches?","options":["Theta","Delta","Gamma","Rho"],"answer":2,"explain":"Short spreads are short gamma. Gamma rises near expiration, so price moves change your P&L faster — one reason the routine exits at 21 DTE."},
 {"q":"Which of these is European-style and cash-settled?","options":["SPY","QQQ","XSP","IWM"],"answer":2,"explain":"XSP (Mini-SPX) is European-style and cash-settled per Cboe. SPY, QQQ and IWM are American-style ETF options that settle in shares."},
 {"q":"You sold a $47/$46 put spread for $0.25. What is the max loss per contract?","options":["$25","$75","$100","$4,700"],"answer":1,"explain":"Width $1.00 minus $0.25 credit = $0.75 × 100 = $75."},
 {"q":"When is early assignment of a short call most likely?","options":["When it is far out of the money","Right after you open the trade","When it is deep in the money just before an ex-dividend date","Never — calls cannot be assigned early"],"answer":2,"explain":"A call holder may exercise early to capture a dividend when the call is deep ITM and has little extrinsic value left."}
]
```
