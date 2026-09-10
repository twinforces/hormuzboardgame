# Hormuz Toll / Hormuz War Game

A GrumpyTechBro joint. Ringmaster is vendored at `.grok/plugins/ringmaster`.

## Session OS

- Load Ringmaster from `.grok/plugins/ringmaster/references/master-prompt.md`.
- Role switches: declare, hygiene, then read the full Core Values file.
- Never use em-dashes. Rewrite the sentence.
- Ignore IP geolocation. User lives outside Springfield, OR.

## Product

Browser war game. One sitting. Hotseat or one human plus scripted AI factions.
Working title: Hormuz Toll. Header title: Hormuz War Game.
Source material: Navy Decoded Hormuz / Epic Fury / Project Freedom cluster.
Design rule: teach industrial and market math, not a Hollywood carrier charge.

Auth OFF. Database OFF. No accounts. localStorage only for last scenario and debug overlay.

## Architecture (non-negotiable)

MVVM, same split as `twinforces/GTB911sim`:

| Layer | Where | Rule |
| --- | --- | --- |
| Model | `src/model/` | Pure TypeScript. No React. No DOM. No SVG. Sim lives in nautical miles. Seeded RNG. |
| ViewModel | `src/viewmodel/` | Commands and derived labels. View never constructs the sim engine. |
| View | `src/view/` | Header, map overlay, role panels. Pretty. Not the argument. |

Unit-test the hell out of Model and ViewModel. Simulate full games in tests.
`npm test` must include `src/model/*.test.ts` and `src/viewmodel/*.test.ts`.

Map: one static image plus SVG overlay. Clicks hit the overlay. No Leaflet in v1.

## Header (player-facing, always)

- Title: Hormuz War Game
- Icon-size circular pfp: `/grumpy-tech-bro.jpg`
- Subtitle: `a GrumpyTechBro joint` linking to https://x.com/GrumpyTechBro in a new tab

## Receipts (standing rule)

Every research source used for this sim goes into `src/model/receipts.ts`.
The `/receipts` page is an annotated bibliography generated from that catalog.
If you use a source, log it the same turn. Partial reads stay marked partial.

## Copy

No em-dashes in player-facing strings (`src/model/copy.ts` and View labels).
Bribe UI must say mines still apply.
STEEL bar must say years, not turns.
Do not frame Saudi bypass as Suez replacing Hormuz.
Do not give Oman a fake trans-peninsula crude line.

## First slice (when Implementer starts)

Tanker path vs static expanding circles, then price and insurance, then factions.
Follow `docs/ARCHITECTURE.md` and `docs/MASTER-DESIGN.md`.
Tunables live in `src/model/balance.ts` only.
