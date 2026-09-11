import { createContext, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { strings } from "@/model/copy.ts";
import {
  getLocale,
  isRtl,
  readStoredLocale,
  setLocale as setModelLocale,
  subscribeLocale,
  type Locale,
  LOCALE_KEY,
} from "@/model/locale.ts";

type Ctx = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  copy: ReturnType<typeof strings>;
};

const LocaleCtx = createContext<Ctx | null>(null);

function applyDoc(locale: Locale) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.lang = locale === "fa" ? "fa" : "en";
  html.dir = isRtl(locale) ? "rtl" : "ltr";
  html.classList.toggle("locale-fa", locale === "fa");
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, set] = useState<Locale>(() => {
    const stored = readStoredLocale();
    setModelLocale(stored);
    return stored;
  });

  useLayoutEffect(() => {
    applyDoc(getLocale());
    return subscribeLocale(() => {
      applyDoc(getLocale());
      set(getLocale());
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      locale,
      copy: strings(),
      setLocale: (next) => {
        setModelLocale(next);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(LOCALE_KEY, next);
        }
        applyDoc(next);
        set(next);
      },
    }),
    [locale],
  );

  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useLocale(): Ctx {
  const ctx = useContext(LocaleCtx);
  if (!ctx) {
    return {
      locale: getLocale(),
      setLocale: setModelLocale,
      copy: strings(),
    };
  }
  return ctx;
}

export function useCopy(): ReturnType<typeof strings> {
  return useLocale().copy;
}
