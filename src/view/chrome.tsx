import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/cn";

const X_PROFILE = "https://x.com/GrumpyTechBro";

const NAV = [
  { to: "/", label: "Board" },
  { to: "/briefing", label: "Briefing" },
  { to: "/architecture", label: "Architecture" },
  { to: "/receipts", label: "Receipts" },
] as const;

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="shrink-0 border-b border-border px-4 py-2 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex min-w-0 items-center gap-3">
            <a
              href={X_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="@GrumpyTechBro on X"
            >
              <img
                src="/grumpy-tech-bro.jpg"
                alt=""
                width={44}
                height={44}
                className="size-11 rounded-full object-cover"
              />
            </a>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                Hormuz War Game
              </h1>
              <a
                href={X_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-2xs text-accent hover:text-fg"
              >
                a GrumpyTechBro joint
              </a>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-md px-3 font-mono text-xs",
                    active
                      ? "bg-surface-2 text-accent"
                      : "text-faint hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <p className="mt-0.5 max-w-3xl text-sm text-muted">
          Hormuz Toll. Teach industrial and market math, not a Hollywood
          carrier charge.
        </p>
      </header>
      <main className={cn("flex-1 px-4 py-3 md:px-6 md:py-4")}>{children}</main>
    </div>
  );
}
