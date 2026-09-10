# Anti-Mine Warfare sitting

Why this exists: the strait sitting is tanker-vs-circles. Anti-Mine Warfare is a **different board**. You are US. Iran as Mine Warfare is later. Traffic is scripted. You do not steer Greece, Inc.

## Two boards, not one zoom

The current Sentinel crop is 54.6E-57.4E, 25.0N-27.5N. That is the strait. Bandar Abbas is on the north lip. Shahroud, Isfahan, Parchin, Khojir are hundreds of kilometers inland. Stretching this photo does not show them. It shrinks Hormuz to a speck or crops them out.

| Board | Who clicks | Photo |
|---|---|---|
| Strait | Tanker owner | Current Hormuz crop. Mines, doors, green sweeps. |
| Iran | US or Iran | A wider Iran crop plus named nodes. Factories, warehouses, radar, port. |

Do not put strike buttons on the strait overlay. A JDAM on a fog circle teaches the wrong lesson.

## Tanker traffic (script, not the gold chip)

People on the tanker sitting still see **accountant** recommendations. They have to learn to ignore a plus-EV till.

When the human is US or Iran, hulls are traffic:

- 100 hulls, 10 companies.
- 4 greedy houses count EV. 6 stubborn houses wait for a sweep, then Oman. They do not pay.
- Once Iran mine risk is higher than Oman, even the greedy flip off the till.

`TRAFFIC.hulls = 100`, `TRAFFIC.companies = 10`, `TRAFFIC.pay = 4`, `TRAFFIC.wait = 6`, shuffled by seed. Mine factory prints 10 a turn until struck. Mine warehouse dumps 3 into the TSS until struck. Drone factory is a different roof. Drone warehouse is a different stack. Warehouse strike zeros that stack only.

## What the Iran board shows

Visible, player-facing:

- Named nodes: mine factory, drone factory, mine warehouse, drone warehouse, radar, port. Markers, not a lecture.
- Magazines as bars: drones, counter-drones, lasers, mines in pool, boats. Numbers go down. That is the remaining fight, not a flavor label.
- Strait inset or a "lane status" chip (Omani mine %, waiting hulls, P). You still care if traffic is moving.
- Spider holes only after a ship is hit. Hidden stash numbers. Not a standing mark.

Not on the board:

- The ideal strike order. After-action can hint. The nodes do not number themselves 1-6.


## US strike choices

One strike pick per week, XOR with a full Hormuz sweep plan (ARCHITECTURE: one Hormuz plan or one off-board later; capital extra).

Player labels: Mine factory / Drone factory / Mine warehouse / Drone warehouse / Radar / Port. A revealed spider hole is an extra verb that week.

Teaching order lives in `STRIKE.ideal` in balance. Tests and the after-action tutor may use it. Copy files must not. If you hit Port first you punched Bandar Abbas and both plants still print.

Why that order (for us, not the board):

1. Mine factory. Roof gone, mine print stops. Navy Decoded inland plant.
2. Drone factory. Separate roof. Shahed output goes toward zero. Radar did not do this.
3. Mine warehouse. Ready mines die. Day-1 dump vs day-10 trickle.
4. Drone warehouse. Ready air dies. Separate sheds from the mine stack.
5. Radar. Drones guess. Mines still drift. Boats still drive by eye.
6. Port. Pierside bullseye. 17 hulls at Bandar Abbas. Hitting those ships lights a spider hole.

Warehouse before radar because leftover stores still sail if the plant is dead and the magazine is not. Radar before port because a blind coast is how traffic lives; a smashed pier is a highlight reel.

## Spider holes

A ship hit reveals one coastal cell: pierside strike, or a tanker that took a graze, a shot-kill, or a mine. Blood in the water is the cue. The tooltip is the stash (mines, drones). Strike it this week. That eats the US verb. Captains balk after a lost hull until you sweep. Strike the hole and traffic sits. No new mole. Leave the hole for next week's resolve and the stash dumps extra TSS mines plus a drone raid on another Gulf state. Fear, not occupation. Radar does not stop the mine dump. Coastal cells recycle. One live hole at a time.


## Magazines (v1 bars)

Iran: drones, mines, boats. US: counter-drones, lasers (or "effectors"), sweepers.

No physics sim. A strike on a factory cuts that refill rate only. A strike on a warehouse cuts that stack only. Radar cuts drone shot, never mine fog. Lasers and counter-drones spend against the drone bar when Iran surges. Keep it one integer per bar.


## Implementer cuts

1. Done: tanker gold chip is accountants. Traffic mix is 4 pay / 6 wait.
2. Done: `STRIKE.ideal` in balance. No player copy.
3. Done: Iran-board plus Strait tab. Sentinel hinterland crop. Node layer + magazine bars.
4. Done: US verb chips Sweep vs Strike. Traffic moves after you act. Iran still lays.
5. Done: Factories do not shrink red circles the week you bomb them. Clearance is rented. Industry is slow.
6. Done: Two plants, two sheds. Radar blinds drones, not mines. A ship hit reveals a spider hole. Ignore it and the stash dumps.

## Don't

- Do not print Mine factory, Drone factory, Warehouse, Radar, Port as a numbered plan.
- Do not mine the till.
- Do not let accountants drive scripted CEO hulls.
- Do not put Khojir on the Hormuz photo by lying about lat/lon.
- Do not fill STEEL.
- Do not let radar shrink mine circles.
- Do not add an Iran Mine Warfare picker until Iran is a human seat.
- Do not let scripted waiters talk crews down after blood.

