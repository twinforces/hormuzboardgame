import { INGEST_COUNTS, RECEIPTS, type ReceiptKind } from "@/model/receipts";
import { useLocale } from "./locale";

const KIND_LABEL: Record<ReceiptKind, string> = {
  "navy-decoded": "Navy Decoded",
  "navy-response": "Navy Response",
  "war-vision": "WarVision",
  official: "Official",
  journalism: "Journalism",
  geography: "Geography",
  market: "Market",
  legal: "Legal / TSS",
  design: "Design",
};

const KIND_ORDER: ReceiptKind[] = [
  "navy-decoded",
  "navy-response",
  "war-vision",
  "geography",
  "market",
  "legal",
  "official",
  "journalism",
  "design",
];

const KIND_LABEL_FA: Record<ReceiptKind, string> = {
  "navy-decoded": "Navy Decoded",
  "navy-response": "Navy Response",
  "war-vision": "WarVision",
  official: "رسمی",
  journalism: "خبرنگاری",
  geography: "جغرافیا",
  market: "بازار",
  legal: "حقوقی / TSS",
  design: "طراحی",
};

export function ReceiptsPage() {
  const fa = useLocale().locale === "fa";
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header>
        <p className="font-mono text-2xs uppercase tracking-widest text-accent">
          {fa ? "کتاب‌شناسی حاشیه‌نویس" : "Annotated bibliography"}
        </p>
        <h2 className="mt-2 text-2xl font-semibold md:text-3xl">{fa ? "رسیدها" : "Receipts"}</h2>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          {fa
            ? "هر منبعی که برای پژوهش این سیم به کار رفت. ناقص یعنی تکه جستجو یا برش رونوشت، نه تماشای کامل. فراداده یعنی در صف است. کامل یعنی آن را خواندیم. افزودن واقعیت بدون رسید شکست بازبین است."
            : "Every source used to research this sim. Partial means a search snippet or transcript excerpt, not a full watch. Metadata means the item is queued. Full means we read the thing. Adding a fact without a receipt is a Reviewer fail."}
        </p>
        <p className="mt-2 font-mono text-xs text-faint">
          {RECEIPTS.length} sources · {INGEST_COUNTS.full} full ·{" "}
          {INGEST_COUNTS.partial} partial · {INGEST_COUNTS.metadata} metadata
        </p>
      </header>

      {KIND_ORDER.map((kind) => {
        const rows = RECEIPTS.filter((r) => r.kind === kind);
        if (rows.length === 0) return null;
        return (
          <section key={kind}>
            <h3 className="font-mono text-xs uppercase tracking-widest text-faint">
              {fa ? KIND_LABEL_FA[kind] : KIND_LABEL[kind]}
            </h3>
            <ul className="mt-3 space-y-3">
              {rows.map((r) => (
                <li
                  key={r.id}
                  className="rounded-md border border-border bg-surface p-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-fg no-underline hover:text-accent"
                    >
                      {r.title}
                    </a>
                    <span className="font-mono text-2xs uppercase tracking-widest text-accent">
                      {r.ingest}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-2xs text-faint">
                    {r.authors} · {r.date} · {r.id}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {r.annotation}
                  </p>
                  <p className="mt-2 font-mono text-2xs text-faint">
                    {fa ? "ضرب‌ها: " : "beats: "}{r.beats.join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
