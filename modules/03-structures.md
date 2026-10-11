# Module 03 — Structures

> **Educational only — not personalized financial advice.** Worked-example numbers are illustrative, not market quotes. Track: [[main]]

## Lesson

Level 2 (Spreads) approval lets you trade **defined-risk** structures: the most you can lose is known at entry. That is what makes the $100-per-trade limit enforceable. Every structure below has a diagram you can change in the [payoff tool](payoff.html).

### 1. Short put vertical (bull put spread)

Sell a put, buy a lower-strike put, same expiration, for a credit.

- **Max profit** = credit. **Max loss** = width − credit. **Breakeven** = short strike − credit.
- **Buying power** ≈ max loss (Schwab holds the spread's risk as margin; spreads require a margin account).
- **When it fits:** neutral-to-bullish, elevated IV rank, liquid underlying.
- **What breaks it:** a fast drop through the short strike.

### 2. Short call vertical (bear call spread)

Sell a call, buy a higher-strike call, for a credit.

- Same math: max profit = credit; max loss = width − credit; **breakeven = short strike + credit**.
- **When it fits:** neutral-to-bearish, or after a sharp rally with elevated IV.
- **What breaks it:** a squeeze higher. Early assignment risk around ex-dividend dates on the short call (Module 01).

### 3. Iron condor

A short put vertical plus a short call vertical in the same expiration.

- **Max profit** = total credit. **Max loss** = wider side's width − total credit (only one side can finish in the money).
- **Buying power** ≈ the larger side's risk at most brokers [[unverified]] for Schwab specifically — check the buying-power effect on the thinkorswim order confirmation.
- **When it fits:** neutral view, elevated IV, range-bound underlying.
- **What breaks it:** a big move in either direction. Four legs also mean **double the fees** of a vertical.

### 4. Jade lizard (advanced)

A short put plus a short call vertical, with total credit ≥ the call spread's width — so there is **no upside risk**. But the put is **naked**:

- Downside risk is large (approximately short put strike − credit, × 100).
- It needs **Level 3 (Uncovered)** approval and does **not** fit a $100 limit. [[adapt]]
- Included so you recognize it, not so you trade it on this account.

### 5. Short strangle (Level 3 — concept only)

Sell an OTM put and an OTM call. **Undefined risk** on both sides. This is the structure most tastylive management studies used on SPY/SPX [[tasty]], which matters because this course applies those findings to *spreads* — an adaptation flagged in Module 05. Not tradable under Level 2 or the $100 limit.

### Picking width and credit

A $1-wide spread caps max loss at $100 minus the credit, so any $1-wide credit spread passes the $100 rule at 1 contract. Wider spreads ($2, $5) fail unless the credit is very large. That is why Module 04 requires **$1-wide strikes**.

## Worked example (illustrative, sized to the $100 limit)

XYZ at $50, 45 DTE, IV rank elevated [[illus]]:

| Structure | Strikes | Credit | Max profit | Max loss | Breakeven(s) |
|---|---|---|---|---|---|
| Short put vertical | 47 / 46 | $0.25 | $25 | $75 | $46.75 |
| Short call vertical | 53 / 54 | $0.25 | $25 | $75 | $53.25 |
| Iron condor | 46 / 47 / 53 / 54 | $0.40 | $40 | $60 | $46.60 / $53.40 |
| Jade lizard | 47P / 53C / 54C | $1.10 | $110 | ≈$4,590 if XYZ → $0 | $45.90 |
| Short strangle | 46P / 54C | $0.80 | $80 | Unlimited | $45.20 / $54.80 |

Only the first three pass the $100 rule.

```payoff
{"structure":"short-put-vertical"}
```

```payoff
{"structure":"short-call-vertical"}
```

```payoff
{"structure":"iron-condor","caption":"Iron condor: max loss is width minus the combined credit, because only one side can lose at expiration."}
```

```payoff
{"structure":"jade-lizard","caption":"Jade lizard: no upside risk because the $1.10 credit exceeds the $1 call-spread width — but the naked put needs Level 3 and blows through the $100 limit."}
```

```payoff
{"structure":"short-strangle","caption":"Short strangle: undefined risk on both sides. Concept only on this account."}
```

## What would break this trade

- **Vertical:** a directional move through the short strike, especially a gap (overnight news) that skips past your strikes.
- **Iron condor:** any large move; higher fees from four legs; a credit too small relative to width.
- **Jade lizard / strangle:** a crash or squeeze with no long option to cap the loss — the reason they are excluded.
- **All:** entering with a too-wide bid/ask, so you start the trade already losing the spread cost.

## Sources

- Schwab, How Can Vertical Spreads Help Your Strategy? (spreads require margin; Level 2): <https://www.schwab.com/learn/story/how-could-vertical-spreads-help-your-strategy>
- tastylive, Managing Losers in Risk Defined Strategies (2016) — iron condor study used in Module 05: <https://tastylive.com/shows/market-measures/episodes/managing-losers-in-risk-defined-strategies-10-24-2016>

## Quiz

```quiz
[
 {"q":"Breakeven of a short put vertical sold at $47/$46 for $0.30?","options":["$46.70","$47.30","$46.00","$47.00"],"answer":0,"explain":"Short strike minus credit: 47 − 0.30 = $46.70."},
 {"q":"Iron condor: put side $1 wide, call side $1 wide, total credit $0.35. Max loss per contract?","options":["$135","$165","$65","$200"],"answer":2,"explain":"Only one side can lose at expiration: $1.00 − $0.35 = $0.65 × 100 = $65."},
 {"q":"Why doesn't a jade lizard fit this account's rules?","options":["It has unlimited upside risk","Its naked put needs Level 3 and its downside risk far exceeds $100","It cannot be traded on ETFs","It has no credit"],"answer":1,"explain":"The short put is uncovered, so downside risk is large and Level 3 approval is required."},
 {"q":"Which structure did most tastylive management studies use?","options":["Long calls","Iron butterflies","Short strangles","Covered calls"],"answer":2,"explain":"Most cited management studies used strangles on SPY/SPX, which is why applying them to spreads is labeled an adaptation."},
 {"q":"At 1 contract, which width always keeps a credit spread's max loss at or under $100?","options":["$1 wide","$2 wide","$5 wide","Any width"],"answer":0,"explain":"Max loss = width − credit. A $1-wide spread's max loss is at most $100 per contract."}
]
```
