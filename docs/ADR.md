# Architecture decision records

Status key: proposed / accepted / superseded.

These are Architect decisions. Veto in chat and they flip. Silence after review means accepted.

## ADR-001. TypeScript MVVM, not vanilla JS files

- **Status:** accepted
- **Context:** Master §14 listed `index.html` + `*.js`. Workspace is TanStack Start. User required MVVM and unit tests of Model and ViewModel with simulated gameplay.
- **Decision:** Pure TS Model + ViewModel, React View. §14 names map to modules under `src/model/`.
- **Why:** Tests cannot honestly simulate a match if the sim lives in the DOM. GTB911sim already uses this split.
- **Rejected:** A second vanilla-JS app beside the React shell. Two stacks would rot.

## ADR-002. Header copy vs working title

- **Status:** accepted
- **Context:** Master working title is Hormuz Toll. User asked for header "Hormuz War Game" plus pfp plus subtitle linking to X.
- **Decision:** Product header = Hormuz War Game. Game name in copy and GitHub = Hormuz Toll. Subtitle exactly `a GrumpyTechBro joint` -> https://x.com/GrumpyTechBro, new tab. Pfp is `/grumpy-tech-bro.jpg` at icon size (44px).
- **Why:** User copy wins the chrome. Working title still names the sim.

## ADR-003. Auth and database stay off

- **Status:** accepted
- **Context:** v1 is one sitting, hotseat or simple AI. Master non-goals include async accounts.
- **Decision:** No sign-in. No Postgres. localStorage for last scenario and debug overlay only.
- **Why:** A high score is not an account.

## ADR-004. Sim space is nautical miles

- **Status:** accepted
- **Context:** Photo is scenery. Circles must not become ovals when CSS stretches.
- **Decision:** All clip, expand, and kill math in nm. Calibration object maps pixel <-> nm. 10 nm scale bar on the overlay.
- **Why:** Master §2.1. Prevents the "pretty map, lying geometry" failure.

## ADR-005. Seeded RNG in the Model

- **Status:** accepted
- **Context:** Gameplay tests must replay. Insurance collapse, secret packages, overzealous IRGC, and AI rolls are stochastic.
- **Decision:** Engine constructed with an integer seed. Tests pin seeds. Debug overlay prints the seed.
- **Why:** Without this, "simulate gameplay" is flaky theater.

## ADR-006. Receipts are a Model catalog, not a blog post

- **Status:** accepted
- **Context:** User standing rule: keep track of every source. One delivery is a Receipts page.
- **Decision:** `src/model/receipts.ts` is the source of truth. `/receipts` renders it. Partial transcript reads stay marked partial. Adding a fact without a receipt id is a Reviewer fail.
- **Why:** The teaching claim is industrial math. Sources are part of the argument, same as G = 9.81 in Collapse Lab.

## ADR-007. Static image + SVG overlay, no Leaflet in v1

- **Status:** accepted
- **Context:** Master was explicit. Leaflet fights tokens with street labels and makes circles less readable.
- **Decision:** One cropped overhead. SVG on top. Same width/height. Hover hit-test on SVG.
- **Follow-up:** Map art must have rights. Prefer NASA / Blue Marble crop or a traced chart. Do not screenshot a proprietary chart.

## ADR-008. AI is scripted tendencies

- **Status:** accepted
- **Context:** Master §9. Not a solver.
- **Decision:** US-AI: factories/depots before pits; carrier stays out unless sensing fails. Iran-AI: soft pressure until desperate; small overplay chance when P is high. Tanker-AI: run if expected $ minus kill-chance looks good; pay only if directed-boat risk dominates and insurance still exists.
- **Why:** A minimax over this hidden-info, fuse-heavy game is a second project.

## ADR-009. Public GitHub repo

- **Status:** accepted
- **Context:** User: build `hormuzboardgame` in their GitHub. Other joints (GTB911sim, genxdespair) are public.
- **Decision:** https://github.com/twinforces/hormuzboardgame is public.
- **Why:** Source published so it can be audited, same as Collapse Lab.

## ADR-010. First Implementer slice is circles vs path

- **Status:** accepted
- **Context:** Master §15. User said coding will be easy after design.
- **Decision:** Implementer starts at geo + dummy circles + tanker path kill test, with unit tests, before factions or chrome beyond the header.
- **Why:** If clip math is wrong, every later system lies.

## ADR-011. NASA Blue Marble crop is the board photo

- **Status:** superseded by ADR-014
- **Context:** ADR-007 left map art rights open. User picked NASA / Blue Marble over a traced-only coast.
- **Decision:** `public/maps/hormuz-blue-marble.jpg` is a GIBS Blue Marble Next Generation crop, bbox 54.6E-57.4E, 25.0N-27.5N, 2016x1800, 2004-01-01. SVG overlay carries TSS, mines, path. Calibration in `src/model/balance.ts`.
- **Why:** Public domain. Known bbox. Photo is scenery so clip tests stay in nautical miles.

## ADR-012. Navy Decoded ingest is honest about what we actually read

- **Status:** accepted
- **Context:** Receipts held search snippets. User asked for an ingest pass.
- **Decision:** Indexed caption excerpts were folded into annotations. Full ASR dump from this environment is blocked (YouTube cloud-IP). Ingest stays `partial` or `metadata` until a complete transcript file lands in `docs/ingest/`. Pretending a snippet is a full watch is a Reviewer fail.
- **Why:** The teaching claim is industrial math. Sources are part of the argument.

## ADR-017. Player runs a VLCC house

- **Status:** accepted
- **Context:** User: it is not really Tanker, it is a shipping company maximizing profits. A sunk ship hits hull cost and family payouts. Who predominates? Are they all independents who own a few ships?
- **Decision:** Role is Owner. Books live on `GameState.books`. Hormuz crude is three buckets: commercial houses (Sinokor, Greek family fleets), Gulf state oil shipping (Bahri, ADNOC L&S, KOTC, NITC, Nakilat), Chinese state shipping (COSCO, China Merchants). Independent in tanker-speak means not an oil-major captive. It is not a size word. Sinokor controlled on the order of 100-plus VLCCs in 2026. A two-ship tramp is the long tail, not the VLCC strait. The player is a commercial house because insurance collapse only bites that paper. Hull sticker $129M (Signal Ocean newbuild). Freight is one voyage TCE, not the oil. Board copy says VLCC house. It does not lecture brand names.
- **Why:** One boom is a ledger event, not a game over. State fleets sit on sovereign insurance. A few-ship picture is the wrong industrial math.


## ADR-018. Greece, Inc. is a fleet. Freight follows P. Captains balk after blood.

- **Status:** accepted
- **Context:** User: riff The Wire and call them Greece, Inc. More than one hull, so you can risk a few early if the price is right. Motivated by greed. Push captains after a sink and they may balk. A kill is $129M plus cargo plus a sailor premium going forward. Maybe Onassis.
- **Decision:** House name on the books is Greece, Inc. Role tab stays Owner. Fleet is 5 hulls on reopen/overplay, 1 on one-transit. Freight uses COMPANY.freightByBand so a fat P is the greed hook. Cargo is the trader's $150M: log it, do not write it off the owner books. After a kill, crewBonusUsdM sticks on later live voyages. Captains balk (doors reject) after blood until you Wait. Wait still works and is how you talk them down. Onassis is the archetype in receipts. Olympic still trades. He is not the name on the board. The Wire riff is the house name, not a lecture.
- **Why:** One captain picking a night was costume. A house with leftover hulls can be greedy. Crews have a contract right to refuse a Warlike Operations Area. Oil on the wreck is not yours, which is why the paper dies.

## ADR-019. Voyage war-risk is a checkbox. Tolls sit on the books. A kill opens a dialog.

- **Status:** accepted
- **Context:** User: dialog when we lose a ship, what/why. 90% kill means chance of being attacked and killed. Iran 57%, but if I pay them then just mines? Balance sheet for tolls. Insurance paid too. Checkbox before US or Iran.
- **Decision:** Door percents are mine kill on that track tonight, not an escort failing and not a missile volley. Pay Iran waves boats. Mines still apply. Toll is $2M (IRGC VLCC floor) and posts to books. War-risk is a checkbox before a door while paper is open. Premium follows heat ($2M cheap to $13M panic). A bought policy pays the hull back. Families still sit on you. Cargo is the trader's. One boom collapses paper for the sitting; you cannot buy after. `lastLoss` feeds a dialog the View must show.
- **Why:** The industrial math is mine density plus a market that walks. Paying Iran is a next-wave factory, not a sweeper.

## ADR-020. Idle is the Oman-China week, not Hormuz TCE twice

- **Status:** accepted
- **Context:** User: idle $4M a hull a week seems high, justify.
- **Decision:** `COMPANY.idleUsdMPerHull` is $2M. That is the teaching round of Gulf of Oman to China (~$220k/day, Oil & Gas 360; Lloyd's peak $358k). Not VLCC cash opex (~$10k/day). Not MEG-China TD3C ~$760k/day. Freight plus bonus already book the Hormuz payday when a hull sails. Leftover hulls still scale because you only send one a week and the rest could have left the queue.
- **Why:** $4M was ~$571k/day, 75 percent of the Hormuz day rate, charged on hulls that did not sail. Accountants do not pay themselves the voyage they skipped and then also bill Hormuz TCE as rent.

## ADR-013. Price P is a seeded teaching index

- **Status:** accepted
- **Context:** Master uses a public meter P. Live EIA would make tests non-deterministic. User: simulated, correlate history in the pricing model.
- **Decision:** `src/model/price.ts` computes P from mine fog, insurance, waiting hulls, exits, contracts. `balance.HISTORY` holds Brent markers (2008 $147, 2022 $120, 2026 peak $126, 9 Sep 2026 $100) for the ticker panel. No `fetch`.
- **Why:** Tests pin P. The panel teaches what "high" meant without lying that the sim is a Bloomberg box.

## ADR-014. Sentinel-2 cloudless replaces Blue Marble at this zoom

- **Status:** accepted
- **Context:** Playtest 2026-09-09. User: the board does not look like the strait. It looks like green noise. Maybe that is Iran, not the strait plus Iran.
- **Decision:** Keep the same bbox (54.6E-57.4E, 25.0N-27.5N, 2016x1800). Swap the pixels to EOX Sentinel-2 cloudless 2024. Add IRAN / UAE / OMAN and water names on the overlay. Retire Blue Marble as scenery. Clip math still never reads pixels.
- **Why:** Blue Marble Next Generation is a 500 m monthly vegetation composite. At a 2.8 degree crop, Iran's hills posterize into green mush. Sentinel-2 is 10 m class, so Qeshm, Hormuz Island, Musandam fjords, and Fujairah actually read. Same calibration. No Leaflet.

## ADR-015. Navy Decoded full ASR from this cloud IP is blocked. Watch-page captions work in chunks.

- **Status:** accepted
- **Context:** User asked for a transcript solution. timedtext, InnerTube, Invidious, and yt-dlp are bot-walled (LOGIN_REQUIRED). Indexed search and YouTube watch-page captions return the first minutes, then truncate.
- **Decision:** Three legal paths, in order. (1) User pastes YouTube Show transcript into chat. (2) Agent walks each watch URL in timestamp chunks into `docs/ingest/nd-<id>.txt`. (3) Search-index excerpts stay partial. Never mark full without a complete file in-repo.
- **Why:** The teaching claim is industrial math. Pretending a 3 minute caption scrape is a 15 minute watch is a Reviewer fail.

## ADR-016. Accountant gold chip. CEO mix is traffic AI.

- **Status:** accepted
- **Context:** User: CEO talk was color for behind-the-scenes tanker AI. People playing the tanker side should see accountant recommendations and have to learn to ignore them. Traffic flavor: 4 pay the till (Iran gets 4 mines), 6 wait.
- **Decision:** Tanker view gold chip stays `accountantPick`. `ceoPick` is a persona. `TRAFFIC` is 4 accountant / 6 CEO, shuffled. Scripted traffic uses `tankerAiPick`.
- **Why:** The till is plus-EV week one. That is the trap. Hiding it behind a CEO chip teaches the wrong sitting.

## ADR-017. Mine warfare is a second board

- **Status:** accepted
- **Context:** Strait crop cannot show Shahroud / Isfahan / Parchin / Khojir. User wants remaining drones / counter-drones / lasers, factory marks, US strike Factory / Warehouse / Radar / Port. User: show both maps, or a tab to the strait to see results.
- **Decision:** New Iran-board sitting. Different Sentinel crop (47E-62E, 25N-38N). Named nodes. Magazine bars. Tabs: Iran (strike) and Strait (traffic / fog). After a US verb the board flips to the strait. Strike labels are the four nouns, never numbered. Ideal order Factory, Warehouse, Radar, Port lives in `STRIKE.ideal` only.
- **Why:** A JDAM on a mine fog circle teaches clearance-is-rented backwards. Industry is inland. The strait stays the tanker board.
- **Rejected:** Zoom the Hormuz Sentinel until Tehran fits. Hormuz becomes a pixel.

## ADR-021. Two plants, two sheds, radar blinds drones, ships reveal spider holes

- **Status:** accepted
- **Context:** User: Mine Factory and Drone Factory are different factories, different warehouses. Radar cuts drone accuracy, not mines (mines drift). Hitting a ship exposes a spider hole with hidden mines/drones. Striking the hole eats a turn. Ignore it next turn and you get more mines, maybe drone attacks on other Gulf states.
- **Decision:** Standing Iran nodes are six nouns: mine factory, drone factory, mine warehouse, drone warehouse, radar, port. Spider holes are revealed, not a seventh lesson on the board. Radar multiplies drone shot only (`ATTACK.radarBlind`). Boats and mine fog ignore it. A ship hit is (1) a port strike on pierside hulls or (2) a tanker graze or shot-kill. That reveal shows the stash integers. The hole is the week's US verb. Leave it alive into the next resolve and the stash dumps extra TSS mines plus a Gulf drone tick (`PRICE.gulfDrone`).
- **Why:** One "factory" button taught the wrong industrial map. Radar as a mine sweeper taught the wrong physics. Spider holes are the whack-a-mole that starts when a hull gets hit, not a labeled pit on day one.
- **Rejected:** One shared plant. Radar shrinking fog circles. Numbering Factory / Warehouse / Radar / Port / Hole on the board.
- **Superseded in part:** ADR-022. A mine kill also reveals. The hole is blood in the water, not a launch cell.

## ADR-022. US sitting is Anti-Mine Warfare. A lost hull lights a spider hole.

- **Status:** accepted
- **Context:** User: US is Anti-Mine Warfare, Iran (later) is Mine Warfare. A ship was lost and no spider hole showed. The prior rule hid the hole on a mine kill because mines drift.
- **Decision:** Sitting label is Anti-Mine Warfare. Scenario id stays `mine-warfare`. Any traffic hull that dies or grazes reveals a spider hole, mine or shot. Port strike still reveals. One live hole at a time.
- **Why:** The player asked for a mole after a hull got hit. A mine kill is still a hit. Hiding the hole taught a physics footnote and looked like a bug.
- **Rejected:** A second picker named Mine Warfare before Iran is a human seat.

## ADR-023. Traffic balks after blood until the Navy sweeps.

- **Status:** accepted
- **Context:** User: endless spider holes. Strike, hull lost, strike, hull lost, week 39, one hull a week. Captains should balk after a ship was lost.
- **Decision:** Scripted waiters do not clear `crewSour`. Only a US sweep or a tanker Wait talks crews down. After a kill, remaining companies that week balk. Next week nobody sails until the Navy is on the ribbon. Striking a spider hole eats the week. Captains stay tied. No new mole.
- **Why:** Six CEOs sitting was treated as a Wait verb, so balk died the same night. One tired hull then ran the unswept mines and lit a new hole. The mole taught you to never sweep.
- **Rejected:** An endless coastal stash as the US sitting.

## ADR-024. Leaving a spider hole dumps it. That is the vanish.

- **Status:** accepted
- **Context:** User: spider hole appeared, then disappeared when they struck something else.
- **Decision:** One US verb a week. Strike inland or sweep and the live hole dumps: extra TSS mines, Gulf drones, the mark is gone. Outcome title is HOLE DUMPED. The hole did not glitch. The stash ran.
- **Why:** The original lock was strike it this week or they dump. Players read the missing circle as a bug because Traffic sat hid the dump.
- **Rejected:** Keep the hole after a factory strike. That would be two US results for one week.

## ADR-025. Leaving a hole is a confirm, not a silent click.

- **Status:** accepted
- **Context:** User still read the dump as a glitch: hole appeared, then disappeared when they decided to strike something else. ADR-024 made the dump the headline, but the click still flipped the board to the strait and killed the mark with no warning.
- **Decision:** Inland strike or sweep while a hole is live opens a confirm: Leave the spider hole? Keep the hole is the gold chip. Strike anyway / Sweep anyway is the dump. Stay on the Iran board. A dumped remnant mark sits on the pit for that week. The stash still runs. XOR is unchanged.
- **Why:** The mole has to be a choice they can refuse. A factory click that also flips the photo looks like the circle despawned.
- **Rejected:** A grace week that keeps the live hole after a factory strike. That is two US results for one week, already rejected in ADR-024.

## ADR-026. Iran is a human seat. Mine Warfare. Lay / Surge / Hold.

- **Status:** accepted
- **Context:** User: ready to do Iran. US is Anti-Mine Warfare. Iran is Mine Warfare. One verb a week: Lay, Surge, or Hold.
- **Decision:** Scenario id `iran-warfare`. Picker label Mine Warfare. Human seat is Iran. Same 100-hull traffic as the US sitting. Turn order is US-AI, then Iran human, then traffic. Week 1 the Navy already struck the mine factory. US-AI follows `STRIKE.ideal` while plants live. After blood it sweeps and talks crews down. Lay dumps the warehouse into the TSS. Surge spends up to `IRAN_VERB.surgeDrones` and ticks a Gulf raid. Hold prints and does not dump. Spider holes stay US-human only.
- **Why:** Playing Iran is industrial math, not a numbered strike plan in reverse. The roof going first is the lesson. A surge is ammo and fear. A real laser wall vs a massed raid is later.
- **Rejected:** A second picker named Mine Warfare before this seat existed (ADR-022). Iran clicking US strike nouns. Radar shrinking mine circles. Scripted waiters talking crews down after blood.

## Open questions

Laser vs "effectors" copy. Real laser wall vs a massed drone surge.
