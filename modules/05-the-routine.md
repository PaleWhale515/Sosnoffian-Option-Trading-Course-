# Module 05 — The 45-DTE Routine

> **Educational only — not personalized financial advice.** Worked-example numbers are illustrative, not market quotes. Track: [[main]] — this is the core of the course.

## Lesson

You cannot watch a screen during the workday. The routine is built for that: every decision happens in the 8:30–10:00 AM CT window, and resting orders plus a calendar reminder do the rest.

### The checklist

**Day 0 — entry (8:30–10:00 AM CT)**

- [ ] Pick a high-IV-rank underlying that passes Module 04's filters.
- [ ] Choose the expiration closest to **45 DTE**. [[sosnoff]] [[tasty]]
- [ ] Sell a **defined-risk** spread (put vertical, call vertical, or iron condor) with **max loss ≤ $100**, 1 contract. [[adapt]]
- [ ] **Immediately** place a **GTC buy-to-close order at 50% of the credit** received. [[tasty]]
- [ ] Set a **calendar reminder for the 21-DTE date** (the [trade ticket](ticket.html) makes an .ics file). [[adapt]]
- [ ] Log the trade in the [journal](journal.html).

**Daily — one morning glance**

- [ ] Did the 50% order fill? If yes, log it and stop.
- [ ] Is today the 21-DTE date? If yes, close.
- [ ] Otherwise: **do nothing.** No intraday watching. [[adapt]]

**Exit — whichever comes first**

- [ ] The 50% GTC target fills, **or**
- [ ] At **21 DTE, close everything regardless of P&L.** [[sosnoff]] [[tasty]]
- [ ] **Do not stop out defined-risk trades on price.** [[tasty]]

### Why each rule exists

**45 DTE.** Sosnoff has described ~45 days out as the "sweet spot" for selling out-of-the-money options and has said he prefers to be out with about 21 days left because of gamma risk ([The Investors Podcast, MI079](https://www.theinvestorspodcast.com/millennial-investing/options-trading-tom-sosnoff/)). [[sosnoff]] (Quoted from a podcast transcript; not checked against the audio — [[unverified]] wording.)

**50% profit target.** tastylive's research on taking profits found that managing winners at 50% reached the target in roughly 23 days on average ([Options Jive — Taking Profits, 08-16-2016](https://tastylive.com/shows/options-jive/episodes/taking-profits-08-16-2016)). [[tasty]] [[unverified]] — the "~23 days" figure comes from the course brief; the episode page could not be opened while building this course. Verify it before relying on it.

**21 DTE close.** tastylive's study of managing losers in risk-defined trades tested SPY iron condors at ~45 DTE (16-delta short strikes, 5-delta wings, since 2005). Managing losers at 1–5× credit **underperformed** holding, and **closing at 21 DTE outperformed** managing losers ([Market Measures — Managing Losers in Risk Defined Strategies, 10-24-2016](https://tastylive.com/shows/market-measures/episodes/managing-losers-in-risk-defined-strategies-10-24-2016)). [[tasty]] A related study looked at exiting winners based on duration ([Market Measures — Managing Winners: Exiting Based on Duration, 01-26-2016](https://tastylive.com/shows/market-measures/episodes/managing-winners-exiting-based-on-duration-01-26-2016)). [[tasty]] [[unverified]] (details of this episode not confirmed).

**No price stops on defined risk.** Same study: stopping out at a multiple of credit cut many trades that would have recovered. With defined risk, the max loss is already capped — the "stop" is the spread width. [[tasty]]

**One glance, no intraday watching.** Course adaptation for your schedule and your history: intraday watching is how a plan turns into impulse trades. [[adapt]]

### Where the research is being stretched

Be honest about the adaptation:

- Most tastylive management studies used **short strangles on SPX/SPY**. The losers study above used **SPY iron condors** — closest to what you trade. [[tasty]]
- Applying these rules to **$1-wide verticals** is an adaptation: narrow spreads have very different P&L paths from strangles (a $1-wide spread's value moves within a $0–$1 band). [[adapt]]
- Applying them to **single stocks** is a bigger stretch: jump risk, earnings, and wider markets were not in those samples. [[adapt]]
- Fees: a $1-wide spread with a $20 credit has a $10 target; ~$2.60 of round-trip Schwab fees is about a quarter of the win. The studies' results do not include your fee drag. [[adapt]]

## Worked example (illustrative, sized to the $100 limit)

Monday, 9:05 AM CT. IWM at $220, IV rank 38 [[illus]].

1. Sell the 45-DTE $210/$209 put vertical for **$0.22** credit → max profit **$22**, max loss **$78**.
2. Place GTC **buy-to-close at $0.11** (50% of $0.22).
3. Expiration is in 45 days → 21-DTE date is 24 days from today. Download the .ics reminder from the [trade ticket](ticket.html).
4. Mornings 1–17: glance, nothing filled, nothing to do.
5. **Scenario A:** Day 18, the $0.11 order fills → +$11 before fees. Log "50% target."
6. **Scenario B:** IWM drifts to $211. The order never fills. On the 21-DTE date the spread is $0.45 → close for −$23 before fees. Log "21 DTE," rule followed = Y.
7. **Scenario C:** IWM gaps to $205. You still do not stop out. On the 21-DTE date the spread is $0.90 → close for −$68. Max loss was always $78.

```payoff
{"structure":"short-put-vertical","spot":220,"longPut":209,"shortPut":210,"premium":0.22,"caption":"The IWM example at expiration. The routine exits at 21 DTE, before this expiration graph fully applies."}
```

## What would break this trade

- **Skipping the GTC order** "just this once" — then you need to watch, which you can't.
- **Ignoring the 21-DTE reminder** and holding into the high-gamma final weeks.
- **Moving the stop** or **adding** to a loser — turning a $78 risk into more.
- **Gap risk** beyond the long strike: capped at max loss, but max loss happens.
- **Fees** making a $10–$11 target too thin on very small credits.

## Sources

- tastylive, Options Jive — Taking Profits (08-16-2016): <https://tastylive.com/shows/options-jive/episodes/taking-profits-08-16-2016>
- tastylive, Market Measures — Managing Losers in Risk Defined Strategies (10-24-2016): <https://tastylive.com/shows/market-measures/episodes/managing-losers-in-risk-defined-strategies-10-24-2016>
- tastylive, Market Measures — Managing Winners: Exiting Based on Duration (01-26-2016): <https://tastylive.com/shows/market-measures/episodes/managing-winners-exiting-based-on-duration-01-26-2016>
- The Investors Podcast, MI079 with Tom Sosnoff: <https://www.theinvestorspodcast.com/millennial-investing/options-trading-tom-sosnoff/>

## Quiz

```quiz
[
 {"q":"You sold a spread for $0.36. What GTC buy-to-close price do you enter immediately?","options":["$0.36","$0.18","$0.72","$0.09"],"answer":1,"explain":"50% of the credit: $0.36 × 0.5 = $0.18."},
 {"q":"Your spread is down $40 with 25 DTE left. What does the routine say?","options":["Stop out now","Add another contract","Do nothing; close at 21 DTE if the target hasn't filled","Roll to a wider spread"],"answer":2,"explain":"Do not stop out defined-risk trades on price. Wait for the 50% target or the 21-DTE exit."},
 {"q":"Expiration is Dec 19. What is the 21-DTE date?","options":["Nov 28","Nov 21","Dec 1","Nov 30"],"answer":0,"explain":"Dec 19 minus 21 days = Nov 28."},
 {"q":"Which part of the routine is a course adaptation rather than tastylive research?","options":["Exiting at 21 DTE","Taking profits at 50%","One morning glance with no intraday watching","Not managing defined-risk losers on price"],"answer":2,"explain":"The once-a-morning schedule is built for your workday and history; the other three come from tastylive studies."},
 {"q":"What structure did the tastylive managing-losers study use?","options":["Short strangles on single stocks","SPY iron condors at ~45 DTE","0DTE SPX butterflies","Long calls"],"answer":1,"explain":"SPY iron condors (16-delta shorts, 5-delta wings) — the closest match to the defined-risk spreads in this course."}
]
```
