# RECENTGOALS

## Active

### Scorecard, idle, Packed TSS, oil cap
- **What:** Out of hulls scorecard + replay. Idle cost. $126 oil cap. Packed TSS punches 3 holes.
- **Why:** Wait was free money. UI froze. Overplay didn't clear. Oil spiked.
- **How:** ScoreDialog, `idleUsdMPerHull`, `PRICE.max` 126, `maxHolesPerWait` 3.

### Iran did not mine the till
- **What:** TSS is mined. Qeshm-Larak is clear. Week one accountants take Iran.
- **Why:** User: they purposely did not lay between Qeshm and Larak.
- **How:** TSS-only field. North path hugs the coast.

### Sweep eats red, weeks, Qeshm-Larak
- **What:** Red fog does not sit inside green. Clock is weeks, no cap. Iran track is Qeshm-Larak.
- **Why:** User: red in green shouldn't exist. Don't limit turns. Checkpoint is between the islands.
- **How:** evenodd + `mineFogCovered`. `maxTurns` 0. `IRANIAN_INBOUND` through the gap.

### Accountants pick the door
- **What:** EV across both doors. Fuse pane removed. Scenario is the sitting kit.
- **Why:** User: accountants, not US/Iran. Fuse/Scenario unclear.
- **How:** `accountantPick`. Owner board is books + EV + this sitting.

### Trader bonus, sit until EV
- **What:** Bonus follows oil price. US chip sits while expected value is negative. Holes actually cut kill.
- **Why:** User thought space-trading cargo. Numbers were a bad bet. Gold chip sent too early.
- **How:** `traderBonusByBand` + `expectedVoyageUsdM`. Recommend wait unless EV >= 0.

### Loss dialog, war-risk, tolls
- **What:** Dialog on a kill. Checkbox buys voyage war-risk before a door. Tolls, premiums, and recover sit on the books. Door percents are mine kill.
- **Why:** User: what/why on a lost hull. Pay Iran then mines. Insurance covers if you bought it.
- **How:** `lastLoss` + `LossDialog`. `tanker-policy`. `COMPANY.tollUsdM` $2M. Premium by band. After a boom you cannot buy.

### Map on top
- **What:** Full-width chart first. Panels under it. No 20rem sidebar.
- **Why:** User: map on top, other stuff under. Map was too small.
- **How:** Play page `flex-col` plus `lg:grid-cols-3` under the board.

### Twelve-turn sitting
- **What:** Reopen / Overplay are 12 turns so five hulls can wait, balk, and still chase freight.
- **Why:** 8 turns was a one-captain clock. A fleet sitting needs leftover turns.
- **How:** `SCENARIO_TURNS` 12. One transit stays 1.

### Greece, Inc. fleet, greed, balk
- **What:** House name Greece, Inc. Five hulls. Freight follows P. After a kill, captains refuse the next door until you Wait. Crew bonus sticks. Cargo is the trader's, not the books.
- **Why:** A sitting is greed across leftover hulls, not one captain picking a night. IBF WOA gives crews the right to refuse. Oil on the wreck is why the paper dies.
- **How:** `COMPANY.fleet` / `freightByBand` / `crewBonusUsdM`. `captainsBalk`. Books panel. Receipts: IBF, Sinokor bonus, Onassis archetype.

### Owner books, not one tanker
- **What:** Player is a VLCC house. Ledger: hulls sent/live/lost, freight, writeoff, families, net. Independent is not a size word. Board does not lecture brands.
- **Why:** A sitting is a company maximizing profit. A kill hits the hull and the families. Not 1-and-done. Not a two-ship tramp.
- **How:** `src/model/company.ts`. View Books panel. Receipts logged the same turn.

### Second click stays wired
- **What:** Gold chip is the VM recommended move on every tanker turn, not only the first Wait. Fog hover uses `pickMine` so blobs do not eat door clicks.
- **Why:** First Wait worked. Second click did nothing because the View unmounted the only live chart control.
- **How:** `onBoardAct` / `actRecommended`. Session test loops live moves until matchOver. View test refuses a wait-only chip.

### Price meter, hover the blobs

### Chart click is the gold move
- **What:** Click the photo to Wait, then to run the Omani door. MapBoard binds `onBoardAct`. Typecheck and a View source test refuse a dropped handler.
- **Why:** Frozen play was V -> VM wiring, not a VM freeze. The session already notified. The chart just never called it.
- **How:** Overlay button on the chart. `boardAct` chip. Sidebar verbs remain. Tests in `session.test.ts` and `view/layer.test.ts`.

### Two-door tanker slice
- **What:** Tanker picks US+Omani or Iran+toll. No freehand track. Wait makes US rent holes and Iran lay so Omani risk leaves 100%. Price overlay sits on the map, lower right. US and Iran briefs conflict on purpose. Chart is first. Navy punched / fog blobs / holes open are tanker intel. Scenario kits print their clock.
- **Why:** Drawing a polyline was costume. Sitting still was a skip, so risk froze. The lesson is industrial math, not a Hollywood plot. Narrow preview buried the photo under the panel.
- **How:** `tanker-omani` / `tanker-toll` / `tanker-wait`. Wait is the gold first move while Omani is 90%+. Tests lock the displayed percent off 100 after one wait, and lock fog count off Iran's magazine.

## Next
1. Iran lay/surge + US industry/pits as real hotseat verbs (today they auto-fire on Wait).
2. Bribes (mines still apply), secret pipeline, fuses, AI, after-action checklist.
3. Avenger class in-theater status stays open research.

## Done this session
- Architect bootstrap (repo, MVVM, receipts, header).
- Open questions closed: NASA crop, ND ingest, simulated P.
- Playable tanker-vs-circles slice, then two-door rewrite.
- Board photo swap after playtest: Sentinel-2, not Blue Marble.
- Architect locks: 1.5 mb/d, 17/120/1500 hulls, cost families, Avenger open.
- Map-first layout, Navy/fog counter, scenario blurbs, hull on the ribbon.
- Frozen play diagnosed as dropped chart click, not a stuck phase.
- Clickable US ribbon (Oman) and Iran track (Larak). No lecture about drawing.
- Price box slimmed. Mine estimate lives on the circle.
