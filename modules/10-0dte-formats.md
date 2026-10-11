# Module 10 — Two Workable 0DTE Formats

> **Educational only — not personalized financial advice.** Worked-example numbers are illustrative, not market quotes. Track: [[lab]] — 0DTE Lab. Practice in paperMoney first.

## Lesson

If you trade 0DTE at all, it must fit your 8:30–10:00 AM CT window and your $100 limit, and it must never require watching the screen at work. Two formats do. Both are **course adaptations** — not tastylive or Sosnoff rules. [[adapt]]

### Lab rules (both formats)

- Defined-risk **credit** spreads only (put vertical, call vertical, or iron condor), $1 wide, max loss ≤ $100, 1 contract.
- At most **one 0DTE trade per day**; it counts toward your max open positions and total open risk.
- Your existing rules apply: each session starts at $0 P&L, 24-hour lockout after 2 consecutive losses, −$300 total stop → paperMoney.
- Log with track = **0DTE** so the scorecard keeps it separate from the main track.

### Format A — the morning window

1. **Wait until ~9:00 AM CT** (30 minutes after the open) to let the opening volatility settle. [[adapt]]
2. Sell a $1-wide credit spread outside the morning's range.
3. Place a GTC/day buy-to-close at your target.
4. **Close by 10:00 AM CT, no matter what.** You leave for work flat.

**Why a 30-minute hold captures little decay.** Time value for an at-the-money option shrinks roughly with the square root of time left (a standard Black-Scholes approximation). [[adapt]] At 9:30 AM CT about 5.5 of 6.5 session hours remain; at 10:00 AM CT, 5.0. The fraction of time value that decays in that half hour is about 1 − √(5.0 ÷ 5.5) ≈ **4.7%**. On a $0.20 credit that is roughly **$0.01 — about $1 per contract** [[illus]]. Most of the day's decay happens in the afternoon, when you are not trading. So Format A is mostly a **directional/mean-reversion trade over 30–60 minutes**, not a theta trade.

**Why fees matter at this size.** Schwab charges $0.65 per contract per leg ([pricing](https://www.schwab.com/pricing)). Opening and closing a 2-leg spread ≈ **$2.60**; an iron condor ≈ **$5.20**. If expected decay over your hold is ~$1, fees are larger than the decay you are selling. To be worth doing, Format A needs a favorable price move — which is a forecast, not an edge you've verified.

### Format B — the "1st triggers OCO" bracket

thinkorswim offers an advanced order type in which the first order (your entry) triggers a one-cancels-other pair (a profit-target order and a stop order). [[unverified]] (name and menu location — "1st trgs OCO" under Advanced Order — check your thinkorswim version; confirm that stop orders are accepted on multi-leg spreads at Schwab).

1. In the morning, enter the spread with a limit price.
2. When it fills, the OCO activates: a **buy-to-close limit** at the profit target (e.g., 50% of credit) and a **buy-to-close stop** (e.g., at 2× credit). [[adapt]]
3. **Leave it alone.**

Critical points:

- **Treat the full max loss as real risk.** Stops on spreads can fill far worse than the trigger in a fast market — or not trigger the way you expect. Size the trade as if the stop does not exist.
- If neither order fills, the spread **runs to the close**. On SPY, that brings pin and after-hours assignment risk (Module 09). **Prefer XSP for Format B** — European and cash-settled, so the worst case is the defined max loss in cash. [[adapt]]
- This *does* capture the afternoon decay — because you hold to the close. That is also why it carries full gamma risk.

Note the contrast with the main track, where the rule is **no price stops on defined risk** (Module 05). The 0DTE bracket is a different instrument with a different time horizon; the stop here is about not holding gamma exposure all day unattended, and it is a course adaptation, not research-backed.

## Worked example (illustrative, sized to the $100 limit)

**Format A.** 9:05 AM CT, SPY $600. Sell the $596/$595 put spread for $0.20 ($20). At 9:58 AM the spread is $0.17 → close. Gross +$3; fees $2.60; **net +$0.40** [[illus]].

**Format B.** 9:10 AM CT, XSP $600. Sell the $605/$606 call spread for $0.20. OCO: buy-to-close limit $0.10 (target), stop $0.40 [[illus]].

| Outcome | Exit | Gross | Fees | Net |
|---|---|---:|---:|---:|
| Target fills at 1:30 PM CT | $0.10 | +$10 | $2.60 | +$7.40 |
| Stop fills cleanly | $0.40 | −$20 | $2.60 | −$22.60 |
| Stop slips in a fast market | $0.75 | −$55 | $2.60 | −$57.60 |
| Neither fills; XSP settles above $606 | $1.00 | −$80 | $1.30 | −$81.30 |

The last row is why max loss — $80 here — is the number that matters.

```payoff
{"structure":"0dte-short-call-vertical","spot":600,"shortCall":605,"longCall":606,"premium":0.20,"caption":"Format B example: $1-wide XSP-style call spread. Max loss $80 is the planning number, not the stop."}
```

```payoff
{"structure":"0dte-iron-condor","caption":"0DTE iron condor: two-sided premium, but four legs ≈ $5.20 round-trip fees on a $30 credit."}
```

```payoff
{"structure":"0dte-long-put","caption":"For comparison: the 0DTE long put the lab replaces."}
```

## What would break this trade

- **Format A:** a trend move in your 30–60 minutes; fees exceeding the tiny decay; staying past 10:00 AM CT "to get back to even."
- **Format B:** stop slippage; an order that didn't actually activate (always confirm the OCO is working in the Order tab); using SPY and getting pinned.
- **Both:** trading after a lockout, or taking a second 0DTE trade the same day.

## Sources

- Schwab pricing: <https://www.schwab.com/pricing>
- Cboe, XSP specifications: <https://www.cboe.com/tradable_products/sp_500/mini_spx_options/specifications>
- Beckmeyer, Branger & Gayda (2023): <https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4404704>

## Quiz

```quiz
[
 {"q":"About how much of an ATM 0DTE option's time value decays between 9:30 and 10:00 AM CT (square-root approximation)?","options":["About 50%","About 25%","About 5%","About 0.1%"],"answer":2,"explain":"1 − √(5.0 ÷ 5.5) ≈ 4.7%. Most decay comes later in the day."},
 {"q":"Round-trip fees for a 2-leg spread at $0.65 per contract per leg?","options":["$0.65","$1.30","$2.60","$5.20"],"answer":2,"explain":"2 legs × 2 trades (open + close) × $0.65 = $2.60."},
 {"q":"In Format B, what number should you size the trade on?","options":["The stop price","The profit target","The full defined max loss","The credit"],"answer":2,"explain":"Stops can slip or not fill. Treat the full max loss as real risk."},
 {"q":"Why prefer XSP for Format B?","options":["Tighter spreads","European, cash-settled — no share assignment if held to the close","It has no fees","It never loses"],"answer":1,"explain":"If the bracket never fills, XSP settles in cash; SPY could leave you with shares and pin risk."},
 {"q":"By when does Format A close?","options":["3:00 PM CT","10:00 AM CT","Noon CT","At expiration"],"answer":1,"explain":"Format A fits your window: enter after ~9:00 AM CT, flat by 10:00 AM CT."}
]
```
