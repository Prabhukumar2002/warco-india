import React, { createContext, useContext, useMemo, useState } from "react";
import { content } from "./data/content";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("warco_lang") || "en");

  const setLanguage = (next) => {
    setLang(next);
    localStorage.setItem("warco_lang", next);
  };

  const value = useMemo(
    () => ({
      lang,
      t: content[lang],
      setLanguage,
      toggleLanguage: () => setLanguage(lang === "en" ? "kn" : "en"),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
