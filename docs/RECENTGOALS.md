# RECENTGOALS

## Active

### Architect the Hormuz Toll web game
- **What:** Load Ringmaster, create `twinforces/hormuzboardgame`, lock MVVM, turn FSM, receipts catalog, and header spec before any sim code.
- **Why:** The master design is the rules. Coding is easy once Model/ViewModel contracts and testability are real. GTB911sim already proved this split.
- **How:** Vendored Ringmaster pack. Public GitHub repo. Domain types in `src/model/types.ts`. Living bibliography in `src/model/receipts.ts`. Briefing UI so the design is reviewable in-browser.

## Next (Implementer, after sign-off)
1. Seeded RNG + balance object + geo calibration types.
2. Path vs dummy circle clip + kill chance unit tests.
3. Static map image + SVG overlay, click-to-plot tanker path.
4. Expand circles one step per turn.
5. Wire price, insurance, then factions.

## Done this session
- Ringmaster plugin vendored to `.grok/plugins/ringmaster` (v0.2.1).
- GitHub repo created: https://github.com/twinforces/hormuzboardgame
- Architect Core Values loaded. Hygiene docs started.
