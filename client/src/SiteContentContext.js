import React, { createContext, useContext, useEffect, useState } from "react";
import { ORG } from "./data/content";

const SiteContentContext = createContext(null);

const FALLBACK = {
  statusText: ORG.hours,
  heroQuote: null, // null = use the language file's default hero title
  phonePrimary: ORG.phonePrimary,
  phoneSecondary: ORG.phoneSecondary,
};

export function SiteContentProvider({ children }) {
  const [siteContent, setSiteContent] = useState(FALLBACK);

  const refresh = () => {
    fetch("https://warco-india.onrender.com/api/site-content")
      .then((r) => r.json())
      .then((data) =>
        setSiteContent({
          statusText: data.statusText || FALLBACK.statusText,
          heroQuote: data.heroQuote || null,
          phonePrimary: data.phonePrimary || FALLBACK.phonePrimary,
          phoneSecondary: data.phoneSecondary || FALLBACK.phoneSecondary,
        })
      )
      .catch(() => {
        /* API not reachable yet — keep static fallback content */
      });
  };

  useEffect(refresh, []);

  return (
    <SiteContentContext.Provider value={{ siteContent, refresh }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be used within SiteContentProvider");
  return ctx;
}
