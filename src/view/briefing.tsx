import { Link } from "@tanstack/react-router";
import { INGEST_COUNTS, RECEIPTS } from "@/model/receipts";
import { useLocale } from "./locale";
import { ADRs_FA, LESSONS_FA, PITCH_FA } from "./briefing-fa";

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
  ["020", "Anti-Mine Warfare is the US sitting. Strikes tab inland. Strait tab shows traffic."],
  ["021", "Two plants, two sheds. Radar blinds drones. A ship hit lights a spider hole."],
  ["022", "A lost hull lights a spider hole. Mine or shot."],
  ["023", "Traffic balks after blood until the Navy sweeps."],
  ["024", "Leaving a spider hole dumps it. That is the vanish."],
  ["025", "Leaving a hole is a confirm, not a silent click."],
  ["026", "Iran is Mine Warfare. Lay, surge, or hold. The Navy bombs roofs. Fear, not occupation."],
  ["027", "After the sheds die, Iran Lay dumps a coastal cell. Four cells. Then dry."],
  ["028", "Fog clips to water. Plan Strikes sits on the strait window."],
  ["029", "EN / فا switch. Farsi is RTL. Header title stays Hormuz War Game."],
];

export function BriefingPage() {
  const fa = useLocale().locale === "fa";
  const pitch = fa ? PITCH_FA : PITCH;
  const lessons = fa ? LESSONS_FA : LESSONS;
  const adrs = fa ? ADRs_FA : ADRs;
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <section className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <p className="font-mono text-2xs uppercase tracking-widest text-accent">
          {fa ? "نقش: پیاده‌ساز" : "Role: Implementer"}
        </p>
        <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
          {fa ? "برش اول روی صفحه است." : "First slice is on the board."}
        </h2>
        <p className="mt-3 max-w-3xl text-muted">
          {fa
            ? "برش سنتینل‌۲ از تنگنا، دایره‌های مین ساختگی که رشد می‌کنند، دو در نفتکش (نوار عمانی یا عوارض ایران)، و عقربهٔ قیمت بذرخورده روی نقشه. این برش یونان، شرکت را می‌رانی. دوازده بدنه. کرایه دنبال قیمت است. بدنهٔ ازدست‌رفته کشتی به‌علاوه خانواده‌ها است. ناخداها بعد از خون سر می‌پیچند. نفت مال تو نیست. ماندن آمریکا را به سوراخ زدن و ایران را به کاشت وامی‌دارد. ریاضی را وتو کن، نه روکش را."
            : "Sentinel-2 crop of the pinch, dummy mine circles that grow, two tanker doors (Omani ribbon or Iran toll), and a seeded price meter on the map. You run Greece, Inc. this slice. Twelve hulls. Freight follows the price. A lost hull is the ship plus the families. Captains balk after blood. Oil is not yours. Wait makes US punch holes and Iran lay. Veto the math, not the chrome."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Stat label={fa ? "رسید ثبت‌شده" : "Receipts logged"} value={String(RECEIPTS.length)} />
          <Stat
            label={fa ? "بلع کامل" : "Full ingest"}
            value={String(INGEST_COUNTS.full)}
          />
          <Stat
            label={fa ? "ناقص / فراداده" : "Partial / metadata"}
            value={`${INGEST_COUNTS.partial} / ${INGEST_COUNTS.metadata}`}
          />
          <Stat label={fa ? "مخزن" : "Repo"} value={fa ? "عمومی" : "public"} />
        </div>
      </section>

      <section>
        <h3 className="font-mono text-xs uppercase tracking-widest text-faint">
          {fa ? "پیچ" : "Pitch"}
        </h3>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {pitch.map((line) => (
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
          {fa ? "درس" : "The lesson"}
        </h3>
        <ol className="mt-3 space-y-2">
          {lessons.map((line, i) => (
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
          {fa ? "تصمیم‌های قفل (وتو در گفتگو)" : "Decisions locked (veto in chat)"}
        </h3>
        <ol className="mt-3 divide-y divide-border rounded-md border border-border bg-surface">
          {adrs.map(([id, text]) => (
            <li key={id} className="flex gap-3 px-4 py-3 text-sm">
              <span className="font-mono text-2xs text-accent">ADR-{id}</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted">
          {fa ? "نوشته کامل در صفحه " : "Full write-up on the "}
          <Link to="/architecture" className="text-accent hover:text-fg">
            {fa ? "معماری" : "Architecture"}
          </Link>
          {fa ? ". منابع در " : " page. Sources on "}
          <Link to="/receipts" className="text-accent hover:text-fg">
            {fa ? "رسیدها" : "Receipts"}
          </Link>
          .
        </p>
      </section>

      <section className="rounded-md border border-dashed border-border p-5">
        <h3 className="font-semibold">
          {fa ? "تصمیم‌های بسته‌شده این گذر" : "Decisions closed this pass"}
        </h3>
        <ol className="mt-2 list-decimal space-y-2 ps-5 text-sm text-muted">
          <li>
            {fa
              ? "هنر نقشه برش مرمر آبی ناسا بود. در این زوم نویز سبز خوانده می‌شد (تپه‌های ایران در ترکیب گیاه). صفحه زنده سنتینل‌۲ بی‌ابر روی همان کادر است. TSS در SVG کشیده شده. عکس صحنه است."
              : "Map art was a NASA Blue Marble crop. At this zoom it read as green noise (Iranian hills in a vegetation composite). Live plate is Sentinel-2 cloudless on the same bbox. TSS is traced in SVG. Photo is scenery."}
          </li>
          <li>
            {fa
              ? "بلع Navy Decoded روی زیرنویس نمایه‌شده رفت. تخلیه ASR کامل از این محیط مسدود است. تکه‌ها هنوز ناقص علامت خورده‌اند. نقل‌هایی که نشست در فهرست است."
              : "Navy Decoded ingest ran against indexed captions. Full ASR dump from this environment is blocked. Snippets are still marked partial. Quotes that landed are in the catalog."}
          </li>
          <li>
            {fa
              ? "عقربه قیمت P شاخص آموزشی بذرخورده به طعم دلار در بشکه است، همبسته با نشان‌های تاریخی برنت. تیک زندهٔ EIA نیست."
              : "Price meter P is a seeded teaching index in USD/bbl flavor, correlated to historical Brent markers. It is not a live EIA tick."}
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
