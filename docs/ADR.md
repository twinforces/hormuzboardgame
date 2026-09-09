# Architecture decision records

Status key: proposed / accepted / superseded.

These are Architect decisions. Veto in chat and they flip. Silence after review means accepted.

## ADR-001. TypeScript MVVM, not vanilla JS files

- **Status:** accepted
- **Context:** Master section 14 listed index.html plus JS files. Workspace is TanStack Start. User required MVVM and unit tests of Model and ViewModel with simulated gameplay.
- **Decision:** Pure TS Model + ViewModel, React View. Section 14 names map to modules under src/model/.
- **Why:** Tests cannot honestly simulate a match if the sim lives in the DOM. GTB911sim already uses this split.
- **Rejected:** A second vanilla-JS app beside the React shell. Two stacks would rot.

## ADR-002. Header copy vs working title

- **Status:** accepted
- **Context:** Master working title is Hormuz Toll. User asked for header Hormuz War Game plus pfp plus subtitle linking to X.
- **Decision:** Product header = Hormuz War Game. Game name in copy and GitHub = Hormuz Toll. Subtitle exactly `a GrumpyTechBro joint` -> https://x.com/GrumpyTechBro, new tab. Pfp is /grumpy-tech-bro.jpg at icon size (44px).
- **Why:** User copy wins the chrome. Working title still names the sim.

## ADR-003. Auth and database stay off

- **Status:** accepted
- **Context:** v1 is one sitting, hotseat or simple AI. Master non-goals include async accounts.
- **Decision:** No sign-in. No Postgres. localStorage for last scenario and debug overlay only.
- **Why:** A high score is not an account.

## ADR-004. Sim space is nautical miles

- **Status:** accepted
- **Context:** Photo is scenery. Circles must not become ovals when CSS stretches.
- **Decision:** All clip, expand, and kill math in nm. Calibration object maps pixel to nm. 10 nm scale bar on the overlay.
- **Why:** Master map notes. Prevents the pretty-map, lying-geometry failure.

## ADR-005. Seeded RNG in the Model

- **Status:** accepted
- **Context:** Gameplay tests must replay. Insurance collapse, secret packages, overzealous IRGC, and AI rolls are stochastic.
- **Decision:** Engine constructed with an integer seed. Tests pin seeds. Debug overlay prints the seed.
- **Why:** Without this, simulate-gameplay is flaky theater.

## ADR-006. Receipts are a Model catalog, not a blog post

- **Status:** accepted
- **Context:** User standing rule: keep track of every source. One delivery is a Receipts page.
- **Decision:** src/model/receipts.ts is the source of truth. /receipts renders it. Partial transcript reads stay marked partial. Adding a fact without a receipt id is a Reviewer fail.
- **Why:** The teaching claim is industrial math. Sources are part of the argument, same as G = 9.81 in Collapse Lab.

## ADR-007. Static image + SVG overlay, no Leaflet in v1

- **Status:** accepted
- **Context:** Master was explicit. Leaflet fights tokens with street labels and makes circles less readable.
- **Decision:** One cropped overhead. SVG on top. Same width/height. Hover hit-test on SVG.
- **Follow-up:** Map art must have rights. Prefer NASA / Blue Marble crop or a traced chart. Do not screenshot a proprietary chart.

## ADR-008. AI is scripted tendencies

- **Status:** accepted
- **Context:** Master section 9. Not a solver.
- **Decision:** US-AI: factories/depots before pits; carrier stays out unless sensing fails. Iran-AI: soft pressure until desperate; small overplay chance when P is high. Tanker-AI: run if expected dollars minus kill-chance looks good; pay only if directed-boat risk dominates and insurance still exists.
- **Why:** A minimax over this hidden-info, fuse-heavy game is a second project.

## ADR-009. Public GitHub repo

- **Status:** accepted
- **Context:** User: build hormuzboardgame in their GitHub. Other joints (GTB911sim, genxdespair) are public.
- **Decision:** https://github.com/twinforces/hormuzboardgame is public.
- **Why:** Source published so it can be audited, same as Collapse Lab.

## ADR-010. First Implementer slice is circles vs path

- **Status:** accepted
- **Context:** Master section 15. User said coding will be easy after design.
- **Decision:** Implementer starts at geo + dummy circles + tanker path kill test, with unit tests, before factions or chrome beyond the header.
- **Why:** If clip math is wrong, every later system lies.

## Open questions (need a veto or a note)

1. Map image rights. Propose a dark, low-label NASA / Blue Marble crop of the pinch point plus the island arc, with TSS traced in SVG. Alternative: fully traced SVG coast, no photo.
2. Navy Decoded transcript completeness. Receipts currently hold search-derived transcripts and descriptions, not a full channel dump. Implementer must not treat snippet quotes as gospel until a full ingest pass.
3. Price units. Master uses a public meter P with bands. Propose P as a dimensionless index around a 2026-ish crude marker, not a live EIA feed. Live prices would make unit tests lie.
