"use client";

import { useEffect, useState } from "react";
import { t, type Language } from "@/lib/translations";

export function LanguageToggle({ language }: { language: Language }) {
  const [hash, setHash] = useState("");
  useEffect(() => {
    function updateHash() {
      setHash(window.location.hash);
    }
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  return (
    <a
      href={`${language === "es" ? "/en" : "/"}${hash}`}
      hrefLang={language === "es" ? "en" : "es"}
      lang={language === "es" ? "en" : "es"}
      aria-label={t(language, "Cambiar idioma")}
      title={t(language, "Cambiar idioma")}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs font-medium text-foreground transition-colors hover:bg-muted/20 focus-visible:outline-2 focus-visible:outline-accent"
    >
      {language === "es" ? "EN" : "ES"}
    </a>
  );
}