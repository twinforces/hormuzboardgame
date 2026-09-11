import { useEffect, useRef } from "react";
import { scoreLines, type ScoreInput } from "@/model/copy.ts";
import { cn } from "@/lib/cn.ts";
import { useCopy } from "./locale.tsx";

export function ScoreDialog({
  open,
  score,
  onReplay,
  onFresh,
  onClose,
}: {
  open: boolean;
  score: ScoreInput | null;
  onReplay: () => void;
  onFresh: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const COPY = useCopy();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && score && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open, score]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      className="m-auto w-[min(100%-2rem,32rem)] rounded-lg border border-accent/50 bg-surface p-5 text-fg shadow-sm backdrop:bg-bg/80"
    >
      {score ? (
        <>
          <h2 className="font-mono text-sm uppercase tracking-widest text-accent">
            {COPY.scoreTitle}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-snug text-muted">
            {scoreLines(score).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={onReplay}
              className="min-h-11 w-full rounded-md bg-accent px-3 font-medium text-accent-fg transition-transform duration-150 ease-out active:scale-[0.96]"
            >
              {COPY.scoreReplay}
            </button>
            <button
              type="button"
              onClick={onFresh}
              className="min-h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm transition-transform duration-150 ease-out active:scale-[0.96]"
            >
              {COPY.scoreFresh}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "min-h-11 w-full rounded-md border border-border px-3 text-sm text-muted",
              )}
            >
              {COPY.scoreClose}
            </button>
          </div>
        </>
      ) : null}
    </dialog>
  );
}
