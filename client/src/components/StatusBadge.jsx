import React from "react";
import { useLanguage } from "../LanguageContext";
import { useSiteContent } from "../SiteContentContext";

export default function StatusBadge({ className = "" }) {
  const { t } = useLanguage();
  const { siteContent } = useSiteContent();

  return (
    <span className={"status-badge " + className}>
      <span className="status-dot" aria-hidden="true"></span>
      <span className="status-live-label">{t.badge.live}</span>
      <span className="status-text">{siteContent.statusText}</span>
    </span>
  );
}
