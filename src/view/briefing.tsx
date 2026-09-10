import { Link } from "@tanstack/react-router";
import { INGEST_COUNTS, RECEIPTS } from "@/model/receipts";

const PITCH = [
  "Play the Strait of Hormuz as the US, Iran, or Greece, Inc.",
  "The US wins by making oil cheap without donating a prestige hull.",
  "Iran wins by fear, insurance death, and a living resupply pipeline, not by occupying water.",
  "The owner wins on the books. Freight follows the price. A kill is not one-and-done.",
];

const LESSONS = [
  "Bomb factories. Bomb storehouses. Then play whack-a-mole on launch sites you can see.",
  "Invite a carrier into the two-mile lane and you volunteered the next mole.",
  "Mines drift. Their uncertainty blob grows every turn.",
  "One mine kill ends the lane's paper. A voyage policy you bought still pays that hull. Then you go naked.",
  "Paying Iran funds the next wave and does not sweep. Mines drift. The percent on a door is mine kill, not a missile volley.",
  "Wait is not a skip. US sinks minelayers. Iran seeds the TSS. Sitting still is a turn.",
  "Greed is a fat trader bonus when oil is high. After blood, captains can still say no.",
  "High price is itself a factory. China and Russia are the quiet factory.",
  "Pipelines take years. Contracts take a week. The market prices the week.",
];

const ADRs = [
  ["001", "TypeScript MVVM, not vanilla JS files"],
  ["002", "Header is Hormuz War Game. Sim name is Hormuz Toll."],
  ["003", "Auth off. Database off."],
  ["004", "Sim space is nautical miles. Photo is scenery."],
  ["005", "Seeded RNG so gameplay tests replay."],
  ["006", "Receipts live in the Model. /receipts renders the catalog."],
  ["007", "Static image + SVG overlay. No Leaflet in v1."],
  ["008", "AI is scripted tendencies, not a solver."],
  ["009", "Public repo twinforces/hormuzboardgame"],
  ["010", "Implementer starts at circles vs path, with tests."],
  ["011", "Map is NASA Blue Marble crop plus SVG overlay."],
  ["012", "Navy Decoded ingest is honest: partial until a full transcript lands."],
  ["013", "Price P is a seeded teaching index, correlated to history, never live."],
  ["014", "Sentinel-2 cloudless replaces Blue Marble at this zoom. Same bbox."],
  ["015", "Navy Decoded full ASR is blocked here. Paste or walk captions in chunks."],
  ["016", "Owner clicks the US ribbon near Oman or the Iran track by Larak. Wait spends both factions."],
  ["017", "Player runs a VLCC house. Books: freight, hull writeoff, families."],
  ["018", "Greece, Inc. Twelve hulls. Freight follows P. Captains balk after blood. Oil is the trader's."],
  ["019", "War-risk checkbox before a door. Tolls on the books. Loss dialog names mine kill."],
  ["020", "Anti-Mine Warfare is the US sitting. Strikes tab inland. Strait tab shows traffic. Iran as Mine Warfare comes later."],
];

export function BriefingPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <section className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <p className="font-mono text-2xs uppercase tracking-widest text-accent">
          Role: Implementer
        </p>
        <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
          First slice is on the board.
        </h2>
        <p className="mt-3 max-w-3xl text-muted">
          Sentinel-2 crop of the pinch, dummy mine circles that grow, two
          tanker doors (Omani ribbon or Iran toll), and a seeded price meter
          on the map. You run Greece, Inc. this slice. Twelve hulls. Freight
          follows the price. A lost hull is the ship plus the families.
          Captains balk after blood. Oil is not yours. Wait makes US punch
          holes and Iran lay. Veto the math, not the chrome.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Stat label="Receipts logged" value={String(RECEIPTS.length)} />
          <Stat
            label="Full ingest"
            value={String(INGEST_COUNTS.full)}
          />
          <Stat
            label="Partial / metadata"
            value={`${INGEST_COUNTS.partial} / ${INGEST_COUNTS.metadata}`}
          />
          <Stat label="Repo" value="public" />
        </div>
      </section>

      <section>
        <h3 className="font-mono text-xs uppercase tracking-widest text-faint">
          Pitch
        </h3>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {PITCH.map((line) => (
            <li
              key={line}
              className="rounded-md border border-border bg-surface p-4 text-sm leading-relaxed"
            >
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-mono text-xs uppercase tracking-widest text-faint">
          The lesson
        </h3>
        <ol className="mt-3 space-y-2">
          {LESSONS.map((line, i) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed">
              <span className="font-mono text-2xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="font-mono text-xs uppercase tracking-widest text-faint">
          Decisions locked (veto in chat)
        </h3>
        <ol className="mt-3 divide-y divide-border rounded-md border border-border bg-surface">
          {ADRs.map(([id, text]) => (
            <li key={id} className="flex gap-3 px-4 py-3 text-sm">
              <span className="font-mono text-2xs text-accent">ADR-{id}</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted">
          Full write-up on the{" "}
          <Link to="/architecture" className="text-accent hover:text-fg">
            Architecture
          </Link>{" "}
          page. Sources on{" "}
          <Link to="/receipts" className="text-accent hover:text-fg">
            Receipts
          </Link>
          .
        </p>
      </section>

      <section className="rounded-md border border-dashed border-border p-5">
        <h3 className="font-semibold">Decisions closed this pass</h3>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>
            Map art was a NASA Blue Marble crop. At this zoom it read as green
            noise (Iranian hills in a vegetation composite). Live plate is
            Sentinel-2 cloudless on the same bbox. TSS is traced in SVG. Photo
            is scenery.
          </li>
          <li>
            Navy Decoded ingest ran against indexed captions. Full ASR dump
            from this environment is blocked. Snippets are still marked
            partial. Quotes that landed are in the catalog.
          </li>
          <li>
            Price meter P is a seeded teaching index in USD/bbl flavor,
            correlated to historical Brent markers. It is not a live EIA tick.
          </li>
        </ol>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-bg px-3 py-2">
      <p className="font-mono text-2xs uppercase tracking-widest text-faint">
        {label}
      </p>
      <p className="font-mono text-sm text-fg">{value}</p>
    </div>
  );
}
