import { PHASE_ORDER } from "@/model/types";

const LAYERS = [
  {
    name: "Model",
    path: "src/model/",
    rule: "Pure TypeScript. No React. No DOM. No SVG. Sim lives in nautical miles. Seeded RNG.",
  },
  {
    name: "ViewModel",
    path: "src/viewmodel/",
    rule: "Commands and derived labels. The View never constructs the engine.",
  },
  {
    name: "View",
    path: "src/view/",
    rule: "Header, map overlay, role panels. Pretty. Not the argument.",
  },
];

const MODULES = [
  ["balance.ts", "Tunables, image calibration, price bands"],
  ["geo.ts", "nm points, polylines, circle clip, corridor holes"],
  ["engine.ts", "Turn order, resolve, fuses, price"],
  ["factions.ts", "US / Iran / tanker action schemas"],
  ["ai.ts", "Scripted v1 tendencies"],
  ["copy.ts", "Teaching beats, tooltips, after-action"],
  ["scenarios.ts", "Reopen / one-transit / overplay / mine-warfare / iran-warfare"],
  ["receipts.ts", "Annotated bibliography"],
  ["rng.ts", "Seeded PRNG"],
];

const LOCKS = [
  "1.4 vs 1.6 mb/d is the same faucet. Sim uses 1.5.",
  "17 pierside warships at match start. 120 speedboats on the water. 1,500 FAC in sheds.",
  "Mine prices are a family: M-08 about $1,500, EM52 about $15,000, influence $15k to $60k.",
  "Destroyer sticker is a family by flight and year. $1.8B to $2.5B can all be true.",
  "Avenger class status is open research. Clearance stays rented either way.",
  "Facebook blockade reel stays a title card. Do not average transcripts.",
];

const INVARIANTS = [
  "Existing mine circles expand one step during expandMines. New lays wait.",
  "Red fog paints water, including the till. It does not paint land.",
  "One tanker mine-kill in the TSS collapses insurance for the match.",
  "Bribes never shrink circles and never grant mine immunity.",
  "STEEL never fills in v1. CONTRACTS can.",
  "US: at most one off-board lever per turn.",
  "Factory hits are permanent. Pit hits relocate.",
  "Capital ships start off-map. Commit paints a prestige target.",
  "High price funds Iran's next-turn pool.",
  "Secret packages still arrive if factories are dead, unless banks and off-board levers pinch them.",
  "Neighbor strike lights OPPOSITION and speeds CONTRACTS.",
];

const TESTS = [
  ["pits-only-while-factories-live", "Tutor flag after 3 pit-only US turns"],
  ["one-boom-kills-insurance", "Insurance collapsed, CONTRACTS +3"],
  ["pay-iran-funds-moles", "Directed boats drop, mines unchanged, pool grows"],
  ["high-price-is-a-factory", "High P grants Iran kits next turn"],
  ["steel-never-fills", "STEEL stays 0"],
  ["us-offboard-once", "Second off-board in one turn is illegal"],
  ["carrier-in-the-lane", "Prestige target flag on"],
  ["neighbor-strike-funds-opposition", "OPPOSITION opens"],
  ["reopen-lane-us-ai-8", "8-turn match completes"],
  ["tanker-naked-hull", "After collapse, hull_factor is 0 or 1"],
];

export function ArchitecturePage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header>
        <p className="font-mono text-2xs uppercase tracking-widest text-accent">
          System
        </p>
        <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
          MVVM, one board, tests that play the game
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          Same split as Collapse Lab. If a critic claims mines sit still or
          that paying Iran sweeps the lane, they open one Model file and a
          matching test.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        {LAYERS.map((layer) => (
          <article
            key={layer.name}
            className="rounded-md border border-border bg-surface p-4"
          >
            <h3 className="font-semibold">{layer.name}</h3>
            <p className="mt-1 font-mono text-2xs text-accent">{layer.path}</p>
            <p className="mt-2 text-sm text-muted">{layer.rule}</p>
          </article>
        ))}
      </section>

      <section>
        <h3 className="font-mono text-xs uppercase tracking-widest text-faint">
          Turn order
        </h3>
        <ol className="mt-3 flex flex-wrap gap-2">
          {PHASE_ORDER.map((phase, i) => (
            <li
              key={phase}
              className="rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs"
            >
              <span className="text-faint">{String(i + 1).padStart(2, "0")} </span>
              {phase}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="font-mono text-xs uppercase tracking-widest text-faint">
          Architect locks, 9 Sep
        </h3>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Ingest is closed. This is a math problem. Transcripts keep their
          numbers. The sim uses one cited knob per family.
        </p>
        <ul className="mt-3 space-y-2">
          {LOCKS.map((line) => (
            <li
              key={line}
              className="rounded-md border border-border bg-surface px-4 py-3 text-sm"
            >
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-faint">
            Modules (master §14, relocated)
          </h3>
          <ul className="mt-3 divide-y divide-border rounded-md border border-border bg-surface">
            {MODULES.map(([file, job]) => (
              <li key={file} className="px-4 py-2.5 text-sm">
                <span className="font-mono text-accent">{file}</span>
                <span className="mt-0.5 block text-muted">{job}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-faint">
            Invariants (tests lock these)
          </h3>
          <ol className="mt-3 space-y-2 text-sm">
            {INVARIANTS.map((line, i) => (
              <li key={line} className="flex gap-3">
                <span className="font-mono text-2xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <h3 className="font-mono text-xs uppercase tracking-widest text-faint">
          Gameplay simulations
        </h3>
        <p className="mt-2 text-sm text-muted">
          Not UI tests. An array of role/action pairs against engine.dispatch.
        </p>
        <ul className="mt-3 divide-y divide-border rounded-md border border-border bg-surface">
          {TESTS.map(([id, assert]) => (
            <li key={id} className="flex flex-col gap-1 px-4 py-2.5 sm:flex-row sm:gap-4">
              <span className="font-mono text-xs text-accent">{id}</span>
              <span className="text-sm text-muted">{assert}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-muted">
        Tanker slice is two doors, not a plotted track. Wait forces US
        clearance and an Iran lay. Price sits on the map.
      </p>
    </div>
  );
}
