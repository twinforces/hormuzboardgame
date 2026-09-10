# Hormuz Toll

A [GrumpyTechBro](https://x.com/GrumpyTechBro) Joint.

Browser war game. One sitting. Play the Strait of Hormuz traffic-separation scheme as the US, Iran, or a tanker captain.

Teach industrial and market math, not a Hollywood carrier charge.

- The US wins by making oil cheap without donating a prestige hull.
- Iran wins by fear, insurance death, and a living resupply pipeline.
- The tanker wins dollars per barrel on exit. Danger pays. Death pays zero.

Header title in the app: **Hormuz War Game**.

## Architecture (MVVM)

Same split as [GTB911sim](https://github.com/twinforces/GTB911sim). Critics: start here.

| Layer | Where | What you are looking at |
| --- | --- | --- |
| **Model** | [`src/model/`](src/model/) | Sim. No React. No SVG. Nautical miles. Seeded RNG. Start at [`src/model/README.md`](src/model/README.md). |
| **ViewModel** | [`src/viewmodel/`](src/viewmodel/) | Commands and labels. The View never constructs the engine. |
| **View** | [`src/view/`](src/view/) | Header, map overlay, role panels. Pretty. Not the argument. |

If you think mines sit still, you want `src/model/geo.ts` and the expand test. If you think paying Iran sweeps mines, you want the bribe resolve and `pay-iran-funds-moles` simulation. If you think STEEL fills in eight turns, you want `steel-never-fills`.

Receipts (annotated bibliography) live in [`src/model/receipts.ts`](src/model/receipts.ts) and render at `/receipts`.

## Status

Playable Greece, Inc. sitting. You are a VLCC house. Accountants pick the fattest plus-EV door. Wait books idle. Out of hulls opens a scorecard with replay. Oil on this meter cannot print past the 2026 peak ($126).

Auth off. Database off. localStorage for last scenario and debug.

Design docs: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/ADR.md`](docs/ADR.md), [`docs/MASTER-DESIGN.md`](docs/MASTER-DESIGN.md).

## How to run

```bash
npm install
npm test
npm run typecheck
npm run dev
```

## License

Source is published so it can be audited.
