# ViewModel

Turns Model state into commands and labels the View is allowed to show.

The View does not construct `Engine`. The ViewModel does.

Responsibilities:

- Gate commands by `state.phase` and current hotseat role.
- Expose ticker, insurance, fuses, suspicion, Pay warning, tutor flags.
- Tanker verbs are two doors plus Wait. Click the US ribbon or the Iran track.
- Recommend Wait while the Omani ribbon is 90%+ so clearance can fire.
- `boardAct` labels the wait chip. Corridor clicks call `omani` and `toll`. Subscribe must fire or the board looks frozen.
- After-action: which teaching beats fired.
- Tanker intel: Navy punched, fog blobs, holes open. Never Iran's magazine.
- Debug overlay fields (radii, package queue, fuse values, price components, seed, navyPulled).


Tests: command rejection in the wrong phase, Pay copy contains "Mines still apply", debug fields populated after a scripted match, Wait drops the displayed Omani percent off 100.

No drawing. No CSS. No SVG.
