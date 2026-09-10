# Hormuz Toll. Master Design Document

Canonical player-rules brief from the project owner. Architecture decisions that relocate files (MVVM, TanStack) live in `ARCHITECTURE.md` and `ADR.md`. This file is the rules of the game.

Working title: Hormuz Toll
Form: Browser web game, one sitting, hotseat or one-human + simple AI factions
Source material: Navy Decoded Hormuz / Epic Fury / Project Freedom cluster (geometry, magazines, mines, factories vs pits, boarding vs escort, visibility as the bolt).
Design rule: Teach industrial and market math, not a Hollywood carrier charge.
No em-dashes in player-facing copy.

## 1. Pitch

Play the Strait of Hormuz traffic-separation scheme as the US, Iran, or Greece, Inc.
The US wins by making oil cheap without donating a prestige hull.
Iran wins by fear, insurance death, and a living resupply pipeline, not by occupying water.
The owner wins a sitting on the books: freight minus hull writeoffs minus family payouts minus crew bonus. Danger pays. A kill is not one-and-done. It is a hole in the ledger. Captains can still say no.

The lesson is whack-a-mole with a factory behind it:

- Bomb factories.
- Bomb storehouses.
- Then play whack-a-mole on launch sites you can see.
- Invite a carrier into the two-mile lane and you volunteered the next mole.
- Mines drift. Their uncertainty blob grows every turn.
- One mine kill ends insurance. The lane can die from a market, not a fleet.
- Paying Iran funds the next wave and does not sweep mines.
- High price is itself a factory.
- China and Russia are the quiet factory.
- US can pinch that factory with Ukraine pressure or China tariffs, at the cost of a Hormuz action.
- Pipelines take years. Contracts take a week. The market prices the week.
- Overplay and bankers walk.
- Hit the neighbors building a door and they fund your opposition.

## 2. Design goals

1. One board, three roles, same rules.
2. Readable in 12 turns.
3. Fog that grows (mine circles), not omniscient hex combat.
4. Industry strikes are slow and permanent. Tactical strikes are fast and renewable.
5. Civilian payoff is the tanker ledger and the oil price ticker.
6. Geopolitics is two off-board buttons and three fuses, not a second game.
7. First slice is static HTML/JS relocated into TS MVVM. Map is static image with SVG layer.

See `ARCHITECTURE.md` §2.1 notes: single overhead image, SVG overlay, sim math in nm, calibration object, 10 nm scale bar, no Leaflet in v1.

## 3. Victory and scoring

Shared public meter: oil price (P).
Price rises when the lane is closed, mined, hit, or stacked with waiting hulls.
Price falls when a corridor holds, tankers exit, existing bypass iron surges, or bypass contracts are signed (expectation, not finished steel).

**US** wins if, at end of match: price is in the tolerable band AND flow count meets a threshold AND no catastrophe flag.
Catastrophe flags: carrier or amphib killed or mission-killed in or near the TSS; or a burning VLCC in the TSS if you had advertised a corridor that turn.
Score = flow + cheap-price bonus − catastrophe − wasted sorties on pits while factories still live (soft tutor, not a hard fail).

**Iran** wins if: one mine-kill tanker (insurance collapse) OR price stays in the panic band for N turns OR a prestige US hull is hit.
Soft win: high bribe income + living secret pipeline.
Hard fail condition (not instant loss, a shrinking ceiling): factories and depots gone AND bankers cut off AND secret packages starved. You can still get a last mine kill.

**Owner** score is the Greece, Inc. ledger across a fleet, not one captain:
- Live exit: +freight that follows P (voyage TCE, not the cargo), minus crew bonus if blood already happened
- Dead: 0 freight, hull writeoff, family payout. Cargo was the trader's $150M. Crew bonus sticks going forward.
- After a kill, captains balk until a Navy hole exists.
- After insurance collapse: no partial insured loss. Naked hull. 0 or 1 only.
Leaderboard is greedy owners, not admirals.

## 4–8. Map, roles, systems, turn order, teaching beats

Unchanged from the owner brief. Implementer follows §7 turn order exactly. Teaching beats are the after-action checklist. Copy constraints in §12 are law.

Short reminders:

- US: one major off-board lever OR a full Hormuz plan per turn. Capital commit is extra and expensive.
- Iran cannot sell mine immunity. Iran does not have a better picture of old mines than the US once the device is in the water.
- Tanker Pay button warning: Mines still apply. Next-wave funding: yes.
- CONTRACTS can fill. STEEL cannot. Label: years, not turns.
- Saudi Petroline dumps on the Red Sea. Then you own Suez / SUMED, Bab el-Mandeb, or the Cape.
- UAE Habshan–Fujairah (ADCOP) is the clean around-Hormuz door.
- Oman is deals, storage, terminals. Not a second Petroline.

## 9. First web slice

UI: map, mine circles, price ticker, insurance banner, fuses, secret pipeline suspicion, three role panels, after-action one-pager.

Scenarios: Reopen the lane (12 turns), One transit, Overplay.

AI v1: scripted tendencies, not a solver.

## 10. Explicit non-goals (v1)

Full 3D physics, finished second pipelines, Ukraine campaign map, color-revolution endgame, SWIFT sim, async accounts, playable Suez / Bab el-Mandeb, perfect information.

## 11. Numbers

Placeholders in `src/model/balance.ts`. Tune after play. Navy Decoded-scale flavor in copy (21 nm, 2 nm lanes) without pretending the balance numbers are classified truth.

## 12. Copy constraints

- No em-dashes.
- No "the Navy just escorts everyone."
- Do not frame Saudi bypass as Suez replacing Hormuz.
- Do not give Oman a fake trans-peninsula crude line.
- Bribe UI must say mines still apply.
- Steel bar must say years.

## 14–15. File split

Relocated under MVVM. See `ARCHITECTURE.md` module map. Bootstrap for Implementer: scaffold is done. Start with tanker-vs-static-circles prototype, tests green, before wiring all factions.
