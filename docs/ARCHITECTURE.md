# Hormuz Toll architecture

Stewarded by the Architect role. Implementer fills bodies. Reviewer and Tester own the quality bar.

This is a teaching sim. The code is the argument. If a critic claims "mines just sit still" or "paying Iran sweeps the lane," they should be able to open one Model file and a matching test.

## 1. Why this shape

The master design asked for vanilla `map.js` / `sim.js` files. This workspace is TanStack Start + React + TypeScript. The user also required MVVM and unit tests of Model and ViewModel, including simulated gameplay.

Those two constraints are not a fight. They are the same job:

- All sim math is pure TypeScript in `src/model/`.
- The §14 file names become modules, not a second stack.
- The View is React + one static map image + SVG overlay, as specified.
- Tests run in Node with `--experimental-strip-types`. No browser. No GPU.

Precedent: [twinforces/GTB911sim](https://github.com/twinforces/GTB911sim). Same three folders. Same test glob. Same header pattern.

## 2. Layers

```
src/model/        GameState, turn FSM, geo in nm, balance, AI, receipts
src/viewmodel/    RoleSession, MapSession, TickerSession, AfterAction
src/view/         Chrome, MapBoard, IranBoard, RolePanels, ReceiptsPage
src/routes/       Thin TanStack wrappers. No sim logic.
```

Rules:

1. View never constructs the engine. ViewModel does.
2. ViewModel never draws. It exposes commands and labels.
3. Model never imports React, DOM, or SVG.
4. Path-clip tests stay in nautical miles. Pixels are a View concern.
5. Every tunable is in `src/model/balance.ts`. Copy is in `src/model/copy.ts`.
6. Seeded PRNG in the Model. Same seed + same orders = same match.

## 3. Module map (master §14, relocated)

| Master name | Lives at | Job |
| --- | --- | --- |
| balance.js | `src/model/balance.ts` | Tunables, image calibration, price bands |
| map.js | `src/model/geo.ts` | nm points, polylines, circle clip, corridor holes |
| sim.js | `src/model/engine.ts` | Turn order §7, resolve, fuses, price |
| factions.js | `src/model/factions.ts` | US / Iran / tanker action schemas and legality |
| ai.js | `src/model/ai.ts` | Scripted v1 tendencies, not a solver |
| copy.js | `src/model/copy.ts` | Teaching beats, tooltips, after-action, no em-dashes |
| scenarios.js | `src/model/scenarios.ts` | Reopen / one-transit / overplay / mine-warfare / iran-warfare |
| (new) | `src/model/receipts.ts` | Annotated bibliography, source of `/receipts` |
| (new) | `src/model/rng.ts` | Seeded mulberry32 or equivalent |
| index.html | `src/view/` + routes | Shell, three panels, ticker, fuses |

## 4. Turn FSM

One source of truth: `state.phase`. Input is illegal outside the acting role's phase.

```
priceTick
  -> hiddenPipeline
  -> expandMines          (existing circles only; new lays wait)
  -> usOrders             (Hormuz plan XOR one off-board lever; capital commit extra)
  -> iranOrders           (new lays spawn tight circles here)
  -> tankerOrders
  -> resolve              (mines along path, boats, missiles, boarding)
  -> bankExit
  -> fuses                (insurance, CONTRACTS, BANKS, OPPOSITION)
  -> decay                (holes, known-pit list)
  -> next turn or matchOver
```

Hotseat: ViewModel enables one role panel per phase.
One-human + AI: ViewModel asks `ai.ts` for the other two roles during their phases.

Ignore clicks during `resolve` and `decay`. That is the board-game "input during animation" bug.

## 5. Invariants (tests must lock these)

1. Existing mine circles expand exactly one discrete radius step during `expandMines`. New lays this turn do not expand until next turn.
2. A mine detonation under a tanker in the TSS sets `insurance = collapsed` for the rest of the match. Binary. No partial war-risk.
3. Bribes never shrink circles, never change clip tests, never grant mine immunity. Copy on the Pay button must say mines still apply.
4. STEEL never fills in v1. CONTRACTS can.
5. US may take at most one off-board lever per turn. That lever competes with a full Hormuz plan.
6. Factory hits are permanent for the match. Depot hits cut ready inventory now. Pit hits relocate.
7. Carrier / amphib start off-map. Commit is a player choice and paints a prestige target.
8. Price in the high / panic band funds Iran's next-turn pool even with damaged plants.
9. Secret packages (China / Russia) still arrive if factories are dead, unless BANKS + off-board levers shrink them.
10. Neighbor strike lights OPPOSITION and speeds CONTRACTS. Shooting the bypass does not stop the bypass.

## 6. Geometry

Sim space is nautical miles. Origin and pixels-per-nm live in `balance.calibration`.

- TSS: three polylines (in / buffer / out), about 2 nm usable each way. Strait about 21 nm at the narrows. IEA also quotes 29 nm at the geographic narrows with 2 nm lanes; copy uses Navy Decoded flavor (21 nm, 2 nm lanes) and Receipts notes the 29 nm geographic figure.
- Mine: circle. Kill chance = f(radius step, path length through circle, draft class).
- Corridor hole: rented clip subtracted from one or more circles. Next expansion can close it.
- 10 nm scale bar is drawn on the overlay so calibration drift is visible.

Image is scenery. Overlay is the game. Do not treat the photo as ground truth until two control points are calibrated (Greater Tunb, a TSS bend, or Bandar Abbas breakwater).

## 7. Test strategy (Tester will deepen; Architect requires this now)

`npm test` runs Node's test runner against Model and ViewModel.

### Must-have Model tests before factions

- Clip: a path that misses a circle has kill chance 0.
- Clip: a path through a radius-1 / 2 / 3 circle uses the balance table.
- Expand: radiusSteps increments by 1, once, on `expandMines`.
- Insurance: first TSS tanker mine-kill collapses it; a second kill does not "re-collapse" or reopen.
- Seed: two engines with seed 1 and identical orders produce identical states.

### Gameplay simulations (the user asked for this)

Scripted matches, not UI. An array of `{ role, action }` against `engine.dispatch`. Assert public meters.

Minimum scripts:

| Script | Assert |
| --- | --- |
| `pits-only-while-factories-live` | After 3 US pit-only turns, tutor flag is on |
| `one-boom-kills-insurance` | Insurance collapsed, CONTRACTS +3, price spiked |
| `pay-iran-funds-moles` | Directed-boat risk drops, mine risk unchanged, Iran pool grows next turn |
| `high-price-is-a-factory` | P in high band => Iran kits next turn |
| `steel-never-fills` | After max CONTRACTS, STEEL is still 0 |
| `us-offboard-once` | Second off-board command in the same turn is illegal |
| `carrier-in-the-lane` | Prestige target flag; catastrophe possible on Iran surge |
| `neighbor-strike-funds-opposition` | OPPOSITION opens, CONTRACTS tick |
| `reopen-lane-us-ai-8` | 8-turn match completes; US-AI prefers factories then depots |
| `tanker-naked-hull` | After collapse, live exit hull_factor 1 or 0 only |

ViewModel tests: command gating by phase, Pay warning string present, debug overlay fields populated.

## 8. View (when Implementer reaches it)

One board. Three role panels. Shared chrome:

- Header (product spec, not optional)
- Price ticker. Board overlay is the meter only: dollars, band, insurance, turn. Teaching disclaimer lives on Briefing. Mines est is a hover/tap on each fog circle.
- Insurance banner OPEN / COLLAPSED
- Fuses: CONTRACTS, BANKS, OPPOSITION. STEEL grey, labeled years.
- Secret pipeline: suspicion only unless interdicted
- After-action one-pager ticking teaching beats hit or missed
- Debug overlay after first playable Reopen-the-lane hotseat: radii, package queue, fuse values, price components

The tanker doors are the two tracks on the photo. `PlayPage` calls `session.omani`, `session.toll`, and `session.wait`. `MapBoard` must accept those three handlers. A dropped prop is a type error, not a silent freeze. Do not lecture the player about drawing a track.

Mobile: role panels stack under the map. Tap targets 44px. No horizontal overflow.

## 9. What we are not building in v1

Hex gunnery, finished second pipelines, Ukraine campaign map, SWIFT, async accounts, playable Suez / Bab el-Mandeb, Leaflet, auth, database.

## 10. Implementer start line

Do not paint factions first. Build this, with tests green:

1. `rng.ts`, `balance.ts`, `geo.ts` (clip + expand)
2. Dummy circles in a tiny `engine.ts` that only does expand + tanker path resolve
3. View: static image + SVG circles + click-to-plot path
4. Then price + insurance
5. Then Iran lay/surge + US industry/pits
6. Then bribes, secret pipeline, fuses, AI, after-action

That is master §15 plus MVVM. Stop after a playable Reopen-the-lane hotseat and show the debug overlay.
