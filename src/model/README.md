# Model

This folder is the argument.

No React. No DOM. No SVG. If you need a pixel, you are in the wrong layer.

Start at `types.ts` (the contract), then `balance.ts` (the knobs), then `geo.ts` (nm math), then `engine.ts` (turn order).

Receipts live here on purpose. A teaching number without a source is a costume.

Tests sit next to the code: `*.test.ts`. Gameplay simulations are Model tests that dispatch a script of actions and assert meters.

The View never imports the engine constructor. That is the ViewModel's job.
