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

## Open questions

None from the Architect bootstrap. Factions, bribes, secret pipeline, and AI wait on this slice being green.