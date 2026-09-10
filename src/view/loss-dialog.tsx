import { useEffect, useRef } from "react";
import { COPY, lossLines } from "@/model/copy.ts";
import type { LossReport } from "@/model/types.ts";

export function LossDialog({
  loss,
  onClose,
}: {
  loss: LossReport | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (loss && !el.open) el.showModal();
    if (!loss && el.open) el.close();
  }, [loss]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      className="m-auto w-[min(100%-2rem,32rem)] rounded-lg border border-danger/50 bg-surface p-5 text-fg shadow-sm backdrop:bg-bg/80"
    >
      {loss ? (
        <>
          <h2 className="font-mono text-sm uppercase tracking-widest text-danger">
            {COPY.lossTitle}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-snug text-muted">
            {lossLines(loss).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <form method="dialog" className="mt-4">
            <button
              type="submit"
              className="min-h-11 w-full rounded-md bg-accent px-3 font-medium text-accent-fg transition-transform duration-150 ease-out active:scale-[0.96]"
            >
              {COPY.lossClose}
            </button>
          </form>
        </>
      ) : null}
    </dialog>
  );
}
