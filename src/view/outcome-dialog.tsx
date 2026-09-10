import { useEffect, useRef } from "react";
import { COPY, outcomeContinue, outcomeLines, outcomeTitle } from "@/model/copy.ts";
import type { TurnReport } from "@/model/types.ts";
import { cn } from "@/lib/cn.ts";

export function OutcomeDialog({
  report,
  onClose,
  onSeeStrait,
  onSeeStrikes,
  spider,
  industryDown,
}: {
  report: TurnReport | null;
  onClose: () => void;
  onSeeStrait?: () => void;
  onSeeStrikes?: () => void;
  spider?: boolean;
  industryDown?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const focus = outcomeContinue({
    spider: spider === true,
    industryDown: industryDown === true,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (report && !el.open) el.showModal();
    if (!report && el.open) el.close();
  }, [report]);

  const lost = report?.kind === "lost";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      className={cn(
        "m-auto w-[min(100%-2rem,32rem)] rounded-lg border bg-surface p-5 text-fg shadow-sm backdrop:bg-bg/80",
        lost ? "border-danger/50" : "border-accent/50",
      )}
    >
      {report ? (
        <>
          <h2
            className={cn(
              "font-mono text-sm uppercase tracking-widest",
              lost ? "text-danger" : "text-accent",
            )}
          >
            {outcomeTitle(report)}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-snug text-muted">
            {outcomeLines(report).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {report.watcher === "us" ? (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onSeeStrikes?.();
                  ref.current?.close();
                }}
                className={cn(
                  "min-h-11 rounded-md px-3 text-sm font-medium transition-transform duration-150 ease-out active:scale-[0.96]",
                  focus === "strikes"
                    ? "bg-accent text-accent-fg"
                    : "border border-border bg-surface-2 text-fg",
                )}
              >
                {COPY.outcomeGoStrikes}
              </button>
              <button
                type="button"
                onClick={() => {
                  onSeeStrait?.();
                  ref.current?.close();
                }}
                className={cn(
                  "min-h-11 rounded-md px-3 text-sm font-medium transition-transform duration-150 ease-out active:scale-[0.96]",
                  focus === "strait"
                    ? "bg-accent text-accent-fg"
                    : "border border-border bg-surface-2 text-fg",
                )}
              >
                {COPY.outcomeGoStrait}
              </button>
            </div>
          ) : (
          <form method="dialog" className="mt-4">
            <button
              type="submit"
              className="min-h-11 w-full rounded-md bg-accent px-3 font-medium text-accent-fg transition-transform duration-150 ease-out active:not-disabled:scale-[0.96]"
            >
              {COPY.outcomeClose}
            </button>
          </form>
          )}
        </>
      ) : null}
    </dialog>
  );
}
