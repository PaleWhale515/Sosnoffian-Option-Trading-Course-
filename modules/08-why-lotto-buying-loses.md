# Module 08 — Why Lotto Buying Loses

> **Educational only — not personalized financial advice.** Worked-example numbers are illustrative, not market quotes. Track: [[lab]] — 0DTE Lab.

## Lesson

Your history is buying cheap out-of-the-money 0DTE SPY options. This module is about why that trade is structurally hard to win, using one of the first academic studies of retail 0DTE trading.

### The study

**Beckmeyer, Branger & Gayda (2023), "Retail Traders Love 0DTE Options… But Should They?"** — working paper on SSRN: <https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4404704>

In our own words, the paper:

- Uses Cboe trade data on **S&P 500 index (SPX) options** that identifies which trades came from retail customers, covering roughly **2021 through early 2023** — including the period after daily SPX expirations were introduced in 2022.
- Finds that retail traders had become heavy users of 0DTE contracts — the abstract, as reported by secondary sources, says **more than 75%** of retail SPX option trades were 0DTE. [[unverified]]
- Finds that, **in aggregate, retail traders lost money** on these options. Reported figures from the abstract: about **$358,000 per day** on average after daily expirations began. [[unverified]] (Numbers taken from search summaries of the abstract; open the SSRN page to confirm the exact figures and period.)
- Points toward **trading costs** — paying the bid/ask spread on fast, small, frequent trades — as a major driver of those losses rather than just "bad picks." [[unverified]] (confirm in the paper's results section).

### Why this matches your experience

Three mechanics explain why far-OTM 0DTE buying tends to bleed:

1. **You need a big move, fast.** A $0.20 call that is $3 out of the money needs the underlying to move more than $3.20 *in hours* just to break even at expiration. [[adapt]]
2. **Decay accelerates against you.** On expiration day, an OTM option's remaining value is all extrinsic, and it goes to zero by the close if the move doesn't come.
3. **Costs are large relative to price.** A $0.01–$0.02 bid/ask spread on a $0.20 option is 5–10% just to get in and out, plus $0.65 per contract each way at Schwab ([pricing](https://www.schwab.com/pricing)). [[adapt]]

The variance risk premium (Module 02) also says buyers of volatility pay, on average, more than the volatility delivered. 0DTE buyers are on the paying side. [[adapt]]

### What the paper does *not* show

- It studies **SPX**, not SPY. The mechanics are similar, but SPY has different liquidity, American exercise, and share settlement. Applying it to SPY is an adaptation. [[adapt]]
- An **aggregate** loss does not mean every trader loses; it means the average outcome was negative.
- It does not prove that 0DTE **selling** is profitable for retail either. See Module 11 — no verified statistics are used for that claim in this course.

### What to do with this

- **Main track:** shift your trading to the 45-DTE routine (Modules 05–07).
- **Lab track:** if you trade 0DTE at all, use defined-risk **credit** spreads inside rules (Module 10), sized to $100, and log them separately in the journal under track = "0DTE."
- **No more lotto buying** in this plan. [[adapt]]

## Worked example (illustrative, sized to the $100 limit)

SPY at $600 at 9:15 AM CT. You buy the $603 call expiring today for $0.20 ($20 per contract) [[illus]].

- Breakeven at expiration: $603.20 — SPY must rise ~0.53% by the close.
- Fees: ~$0.65 to open + $0.65 to close = $1.30 → a 6.5% hurdle on a $20 bet before any move.
- If SPY finishes at $601: the call expires worthless → −$20.65 (fee to open only).
- If SPY finishes at $604: worth $1.00 → +$100 − $20 − $1.30 ≈ **+$78.70**.

Lotto payoffs look exciting. The question is how often the +$78 outcome happens versus the −$20 outcome — and the study's aggregate result suggests it is not often enough after costs.

```payoff
{"structure":"0dte-long-call","caption":"0DTE OTM call: loss is capped at the debit, but SPY must move past $603.20 within hours to profit."}
```

## What would break this trade

(The "trade" here is the lotto buy — what makes it fail?)

- **No move** — the most common outcome on any given day.
- **A move that comes too late** — after you've sold at a loss, or after the close.
- **Spread and fee drag** on very cheap contracts.
- **Overtrading** — several lotto tickets per day compounds the costs above.

## Sources

- Beckmeyer, Branger & Gayda (2023), SSRN working paper: <https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4404704>
- Schwab pricing: <https://www.schwab.com/pricing>
- Cboe XSP / SPX specs (index option settlement): <https://www.cboe.com/tradable_products/sp_500/mini_spx_options/specifications>

## Quiz

```quiz
[
 {"q":"What did Beckmeyer, Branger & Gayda study?","options":["SPY stock trades","Retail trading in SPX options, including 0DTE","Bitcoin options","Hedge fund strangles"],"answer":1,"explain":"They studied Cboe SPX option trades with retail identifiers, focusing on 0DTE after daily expirations were introduced."},
 {"q":"What was the paper's headline finding about retail 0DTE traders in aggregate?","options":["They profited consistently","They lost money on average","They broke even exactly","They only sold options"],"answer":1,"explain":"In aggregate, retail traders lost money; confirm the exact dollar figures on the SSRN page."},
 {"q":"You buy a $603 call for $0.20 with SPY at $600. Breakeven at expiration?","options":["$600.20","$603.00","$603.20","$602.80"],"answer":2,"explain":"Strike plus premium: 603 + 0.20 = $603.20."},
 {"q":"Applying the paper's findings to SPY is…","options":["A direct finding of the paper","A course adaptation — the paper studied SPX","Proven false","Irrelevant"],"answer":1,"explain":"The paper used SPX data. SPY differs in exercise style, settlement and liquidity, so the application is an adaptation."}
]
```
