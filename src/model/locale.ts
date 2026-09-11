/**
 * Player locale. Model stays English in tests. The View sets this
 * before labels() run. Stored lines from a prior week stay in the
 * language they were written.
 */

export type Locale = "en" | "fa";

export const LOCALE_KEY = "hormuz.lang";

let current: Locale = "en";
const listeners = new Set<() => void>();

export function getLocale(): Locale {
  return current;
}

export function setLocale(next: Locale): void {
  if (next !== "en" && next !== "fa") return;
  if (current === next) return;
  current = next;
  for (const fn of listeners) fn();
}

export function subscribeLocale(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function isRtl(locale: Locale = current): boolean {
  return locale === "fa";
}

export function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const raw = window.localStorage.getItem(LOCALE_KEY);
  return raw === "fa" ? "fa" : "en";
}
