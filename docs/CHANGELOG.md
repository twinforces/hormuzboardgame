# CHANGELOG

## 2026-09-10 - Traffic balks after blood. No more mole mill.

- **What:** After a lost hull, scripted traffic sits until you sweep. Striking a spider hole no longer feeds a new hole the same week. Captains refuse until the Navy is on the ribbon.
- **Why:** User: endless spider holes. Strike, hull lost, strike, hull lost, week 39, one hull a week. Captains should balk after a ship was lost.
- **How:** Stop clearing `crewSour` when waiters sit. Sweep still talks them down. ADR-023.

## 2026-09-10 - Anti-Mine Warfare. A lost hull lights a spider hole.

- **What:** US sitting label is Anti-Mine Warfare. A traffic hull that dies or grazes reveals a spider hole, including a mine kill. Iran as Mine Warfare is later.
- **Why:** User: US is Anti-Mine Warfare, Iran is Mine Warfare. A ship was lost and no hole showed.
- **How:** `SCENARIO_KIT` label. `shipHit` on any loss or graze. Spent pits recycle. ADR-022.
- **Hash:** `57d4003`.

## 2026-09-10 - Circles on the Iran map. Continue row. US oil scale.

- **What:** Strike chips no longer sit on the photo. Each node is a clickable circle with an emoji and dark text on a cream chip. Continue is Go to strikes / Go to strait side by side. A live spider hole highlights strikes. An empty board highlights the strait. US traffic needs ten live hulls to match one tanker-house exit. A ship hit still spikes the same.
- **Why:** User: six buttons covered the map, white labels died on light land, clicking a circle is the US verb, continue should point at the mole or the lane, one hull as Greece Inc should not equal one hull in a hundred-ship week.
- **How:** IranBoard HTML marks. `outcomeContinue`. `PRICE.usFlowHulls` 10 on flow and waiting, not on kill.

## 2026-09-10 - Two plants, two sheds, spider holes after a ship hit

- **What:** Mine factory and drone factory are different roofs. Mine warehouse and drone warehouse are different stacks. Radar makes drones guess and does not move mines. Hitting pierside ships or grazing a tanker lights a spider hole with a hidden stash. Striking the hole eats the week. Ignore it and the stash dumps extra TSS mines plus a Gulf drone raid.
- **Why:** User: different factories, different warehouses. Radar cuts drone accuracy, not mines. Hitting a ship exposes a spider hole. Strike it or get more mines and maybe drones on other Gulf states.
- **How:** Split industry flags. `ATTACK.radarBlind` on drone shot only. Port strike and tanker graze/shot-kill call `revealSpider`. `dumpSpiders` lays the stash and ticks `PRICE.gulfDrone`.


## 2026-09-10 - Tanker CEO waits the ribbon. Never pay.

- **What:** Gold chip is `ceoPick`. Wait while Omani mine > 15% or shot > 12%. Then Oman. Never Iran. After 6 waits, sail anyway. Accountants still show EV.
- **Why:** User: wait until risk is low, never give Iranians money, fuck the accountants, that is why they are not the CEO.
- **How:** `CEO` in balance.ts. `ceoPick` in company.ts. Session recommended uses CEO. ADR-016.
- **Hash:** `405c34b`.

## 2026-09-10 - Live exits cut oil. Green sweeps clip to deep water.

- **What:** A hull that leaves the strait drops P (exitRelief 16 beats a week's fog). Price reticks after expand so the meter matches the map. Green holes clip to DEEP_WATER (Omani TSS / JMIC). Red fog can still sit on the till.
- **Why:** User: tankers leaving should lower oil. USN should only sweep deep water.
- **How:** PRICE.exitRelief 16. tickPrice at tankerOrders. DEEP_WATER polygon + clipPath. inSweepZone.
- **Hash:** `405c34b`.

## 2026-09-10 - Drift reaches the till. Sweeps stay on the Omani ribbon.

- **What:** Navy holes only erase the Omani ribbon. Fog that grows onto Qeshm-Larak counts on the Iran door. Copy: pay does not sweep, mines drift. Week-1 Oman is the mined fraction of the lane (~66%), not a stacked 100%.
- **Why:** User: red covering the Iran route with 0% mine kill. Mines suck. They drift.
- **How:** `paintFogField(path, mines, draft, sweepPath)`. Lane sample. Holes gated by sweep ribbon.
- **Hash:** `405c34b`.

## 2026-09-10 - Twelve hulls, toll buys mines, traders paid you

- **What:** Reopen the lane is 12 hulls. Scorecard and SUCCESS name trader bonus and "You spent $XM in tolls, buying Iran N mines." USN-only sitting: you waited the Navy. Iran-only: mines stayed someone else's problem.
- **Why:** User: sitting over too quick. Result must make the toll-for-mines deal and the invented-but-taught trader bonus loud.
- **How:** COMPANY.fleet.reopen-lane 12. books.minesBought / iranSent / omaniSent. scoreLines + outcomeLines.
- **Hash:** `405c34b`.

## 2026-09-10 - Mine % is remaining fog, not stacked circles

- **What:** Door mine kill is remaining black / painted field. Paint mine disks, punch Navy holes, overlaps are union. Navy still picks leftover devices by path clip.
- **Why:** User: overlapping circles make the math hard. Draw mines black, erase sweeps white, count the remaining red.
- **How:** `paintFogField` raster in nm. No canvas. Model cannot import DOM.
- **Hash:** `405c34b`.

## 2026-09-10 - Shot, graze, outcome dialog, leftover mines, cropped chart

- **What:** Door risk splits mine vs shot. Pay cuts shooting. Escort cuts shooting. A VLCC usually grazes. Wait/door opens an in-your-face outcome. Sweeps no longer zero leftover red. Chart JPEG is the visible 2016x1220 crop plus a loading overlay.
- **Why:** User: week 2 both doors 0%, red in the US zone with 0% Oman, clicks dead, buried turn text, hole/punch metaphor, tankers are tough, Navy escorts, Iran cannot promise the mine.
- **How:** Own-hole clip. `expiresInTurns` 2. `ATTACK` + `combat.ts`. `TurnReport` + OutcomeDialog. Cropped `hormuz-sentinel.jpg`.
- **Hash:** `405c34b`.

## 2026-09-10 - Idle is Oman-China, not Hormuz TCE twice

- **What:** Idle $4M a hull a week dropped to $2M. Books note names Oman-China. Receipts lock $220k/day outside vs $760k MEG-China.
- **Why:** User: idle seems high, justify. $4M was 75 percent of the Hormuz day rate on hulls that did not sail.
- **How:** `idleUsdMPerHull` 2. ADR-020. og360 and Lloyd's receipts.
- **Hash:** `405c34b`.

## 2026-09-10 - Compact + hygiene

- **What:** RECENTGOALS cut to four live bets. README status is playable, not Architect stub. Hashes stamped 9771380. Pushed to twinforces/hormuzboardgame.
- **Why:** User: compact, then hygiene with commit and push.
- **How:** Ringmaster hygiene playbook. Merge kept workspace docs over the Architect stub.
- **Hash:** b41222c.

## 2026-09-10 - Scorecard, idle, Packed TSS, oil cap

- **What:** Out of hulls opens a scorecard with replay. Idle hits the books. Oil caps at $126. Packed TSS, three holes a week.
- **Why:** User: UI froze, wait printed $290M, oil never that high, overplay didn't clear, no urgency.
- **How:** ScoreDialog. `idleUsdMPerHull`. `PRICE.max` 126. `maxHolesPerWait` 3.
- **Hash:** 9771380.

## 2026-09-10 - Iran did not mine the till

- **What:** Mines sit in the TSS. Qeshm-Larak is clear on purpose. North door is the tempting bet.
- **Why:** User: they purposely did not lay between Qeshm and Larak.
- **How:** Dropped `m-qeshm-larak`. TSS-only lays. Iran path hugs the north coast.
- **Hash:** 9771380.

## 2026-09-10 - Sweep eats red, weeks not a clock, Qeshm-Larak

- **What:** Red fog does not sit inside a green sweep. Clock is week count, no cap. Iran track runs between Qeshm and Larak.
- **Why:** User: red in green should not exist. Don't limit turns. Checkpoint is Qeshm-Larak.
- **How:** evenodd clip + `mineFogCovered`. `maxTurns` 0. `IRANIAN_INBOUND` through 26.82N 56.31E.
- **Hash:** 9771380.

## 2026-09-10 - Accountants pick the door

- **What:** Gold chip is expected value, including Iran. Fuse pane gone. Scenario pane is "This sitting".
- **Why:** User: good accountants, don't care about US/Iran talk. Fuse/Scenario were opaque.
- **How:** `accountantPick`. US/Iran briefs off the owner board. CONTRACTS/STEEL/BANKS sit in debug.
- **Hash:** 9771380.

## 2026-09-10 - Trader bonus, sit until the math works

- **What:** Charterers bid a bonus that follows P. Gold chip stays Wait until expected value is positive. Holes cut more of the annulus so "clearing mines" is not a 72% leftover.
- **Why:** Owner is a taxi, not a space trader. US was sending you at 72% kill after one Wait.
- **How:** `traderBonusByBand`. `expectedVoyageUsdM`. Recommend on EV. `CLEARANCE.holeFactor` 0.9. Receipt: TotalEnergies ~$20M extra / $10/bbl.
- **Hash:** 9771380.

## 2026-09-10 - Loss dialog, war-risk checkbox, tolls on the books

- **What:** Boom opens a dialog that names mine kill, door, toll, and whether a policy paid the hull. War-risk is a checkbox before a door. Tolls and premiums sit on the books.
- **Why:** 90% is mine kill, not a missile volley. Pay Iran waves boats, not devices. Cover is a voyage you buy, then the paper dies.
- **How:** `lastLoss`, `tanker-policy`, `COMPANY.tollUsdM` / `premiumByBand`. Receipts: AGBI war-risk, Maritime Executive IRGC floor.
- **Hash:** 9771380.

## 2026-09-10 - Map on top, full width

- **What:** Chart sits on top at full board width. Owner, fuses, and kits sit under it in three columns. No more sidebar stealing the photo.
- **Why:** Side-by-side made the strait a stamp. The board is the game.
- **How:** Play page stacks `flex-col`. `max-w-7xl`. Test refuses the old `1fr / 20rem` split.
- **Hash:** 9771380.

## 2026-09-10 - Twelve-turn sitting

- **What:** Reopen the lane and Overplay run 12 turns. One transit stays 1 hull, 1 turn.
- **Why:** Five hulls plus wait plus balk do not fit in 8. Greed needs leftover clock.
- **How:** `SCENARIO_TURNS` and `MATCH.maxTurns`. Copy blurbs. Tests lock 12, not 8.
- **Hash:** 9771380.

## 2026-09-10 - Greece, Inc. fleet, greed, balk

- **What:** You run Greece, Inc. Five hulls on the 8-turn kits. Freight follows the price band. After a kill, captains refuse the next door until you Wait. Remaining voyages pay crew bonus. Cargo stays off the owner books.
- **Why:** One captain picking a night was costume. Greed is leftover hulls versus a fat TCE. Crews have a contract right to say no. Oil was the trader's.
- **How:** `freightByBand`, `captainsBalk`, `crewBonusUsdM`. Board: Greece, Inc. books, hulls left, this voyage. Receipts: IBF WOA, Sinokor six-month bonus, Onassis archetype. Tests: balk, crew line, cargo not in net.
- **Hash:** 9771380.

## 2026-09-09 - Independent is not a size word

- **What:** Board still says VLCC house. Receipts now teach three Hormuz buckets: commercial houses, Gulf state oil shipping, Chinese state shipping. Independent means not an oil-major captive. It does not mean a few ships.
- **Why:** User: we do not need a brand lecture. Are they all indys who own a few hulls? No. Sinokor is 100-plus VLCCs. Bahri is a state fleet. A two-ship tramp is the tail.
- **How:** Receipt annotations, ADR-017, Bloomberg Sinokor receipt. Tests lock the three-bucket split and refuse a few-ship picture.
- **Hash:** 9771380.

## 2026-09-09 - Owner books, not one tanker

- **What:** You are a VLCC house. The sitting is a ledger: freight, hull writeoff, families. Wait still does not send a hull. A door does.
- **Why:** One hull was costume. A kill is the ship plus the families.
- **How:** `COMPANY` in balance. `postVoyage` in `company.ts`. Panel on the board. Receipts: AGBI fleets, Semafor shuttle split, CRS owner table, Signal Ocean $129M newbuild.
- **Hash:** 9771380.

## 2026-09-09 - Second click was unwired

- **What:** After Wait, the gold chip stays up and runs the VM's recommended move. Mine hover no longer sits on top of the doors.
- **Why:** First Wait worked. The chip then vanished, so the second click hit fog instead of a live command. The model was already back at tankerOrders. The View dropped the wire.
- **How:** `onBoardAct` -> `actRecommended`. Gold chip while `canAct`. `pickMine` for hover. Tests: wait then a second live move, never `recommended: none` while the tanker can act.
- **Hash:** 9771380.

## 2026-09-09 - Price meter, hover the blobs

- **What:** Price box is the meter: dollars, band, insurance, turn. No EIA lecture, no component dump. Hover or tap a fog circle for mines est, fog radius, and a rented hole if the Navy punched one.
- **Why:** The box was a lecture. The estimate belongs on the blob. A click on a circle that did nothing felt broken.
- **How:** `fogTip` on `MineHit` / `MineTip`. Price overlay drops `COPY.notLive` and the five chips. Tests lock both.
- **Hash:** 9771380.

## 2026-09-09 - Click the tracks, not the whole photo


- **What:** US ribbon near Oman and Iran track by Larak are the clickable doors. Copy no longer says you do not draw a track. Wait is a chip only while fog is closed. Iran chip sits on Larak. Corridor hit is fat enough to tap.
- **Why:** Telling the player they cannot plot was costume. The tracks were already the verbs.
- **How:** Corridor hit strokes plus 44px door chips. `onOmani` / `onIran` / `onWait`. Tests lock Larak in the hint and refuse "draw a track".
- **Hash:** 9771380.

## 2026-09-09 - Chart click was a dead wire


- **What:** The gold move is a chart click again. Wait, then Omani, from the photo itself. Typecheck now fails if MapBoard drops `onBoardAct`. A View source test locks the V to VM bind.
- **Why:** Copy said "click the chart." PlayPage passed the handler. MapBoard never took it. Extra JSX props vanish at runtime, so the sitting looked frozen while the VM was fine.
- **How:** MapBoard Props include `canAct` / `boardAct` / `onBoardAct`. Transparent hit target over the photo. Gold chip prints the recommended verb. VM test locks the label. Sidebar doors still work.
- **Hash:** 9771380.

## 2026-09-09 - Map first, Navy counter, kits explain themselves


- **What:** Chart sits above the tanker panel so the photo does not vanish in a narrow pane. Fog is thinner. A hull sits on the Omani door and runs the track when you pick one. HUD counts Navy punches, fog blobs, and open holes. Tanker never sees Iran's magazine. Each scenario kit now prints its clock and starting fog.
- **Why:** Playtest: map gone, nothing moving, no mine count, mystery Scenario buttons.
- **How:** `order-first` removed. `md` split. Intel HUD from `navyPulled` plus visible circle count. Wait still punches. Labels refuse magazine as a total.
- **Hash:** 9771380.

## 2026-09-09 - Wait is the first move, not a skip


- **What:** Two-door tanker board. Wait is the gold first action while Omani risk is 90%+. US and Iran briefs are color-split and show the last punch/lay. Price meter is a compact overlay on the lower-right of the map. Door labels sit on the corridors. Mobile puts the tanker panel above the photo.
- **Why:** Risk sat at 100% because Wait looked like a skip. The engine already dropped Omani 100 to 72. The board had to say so.
- **How:** Session `recommended` is wait then omani. Tests lock displayed percent off 100, plus US hole / Iran lay lines.
- **Hash:** 9771380.

## 2026-09-09 - Two doors, wait spends both sides, price on the map

- **What:** Tanker no longer plots a track. Two verbs: US plus Omani corridor, or toll plus Iran door. Wait makes US rent holes and Iran lay. Price meter is a lower-right map overlay. US and Iran briefs conflict on purpose.
- **Why:** One sitting, industrial math. Drawing a polyline was costume. Risk stuck at 100% because factions were no-ops on wait.
- **How:** `tanker-omani` / `tanker-toll` / `tanker-wait`. Gameplay sim: wait drops Omani kill. Toll funds the pool and does not grant immunity.
- **Hash:** 9771380.

## 2026-09-09 - Leave ingest. Architect locks.

- **What:** Closed the Navy Decoded ingest. Encoded GrumpyTechBro resolutions in `FORCE`, `COST_FAMILY`, and `OPEN_RESEARCH`. Receipt `architect-locks-2026-09-09` plus Architecture page. Facebook stays a title card.
- **Why:** 1.4 vs 1.6 is the same faucet. 120 hulls is speedboats. 17 is pierside warships. Mine and destroyer prices are families. Avenger is still research. This is a math problem.
- **How:** One cited knob per family. Tests lock 17 / 120 / 1500 / 1.5 and refuse a blended destroyer sticker.
- **Hash:** 9771380.
