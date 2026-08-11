import React from "react";
import { useLanguage } from "../LanguageContext";
import { useSiteContent } from "../SiteContentContext";
import StatusBadge from "./StatusBadge";

export default function EmergencyBar() {
  const { t } = useLanguage();
  const { siteContent } = useSiteContent();

  return (
    <div className="emergency-bar">
      <div className="container d-flex flex-wrap align-items-center justify-content-center gap-2">
        <StatusBadge className="me-1" />
        <span>{t.emergencyBar}</span>
        <a
          href={`tel:${siteContent.phonePrimary.replace(/\s/g, "")}`}
          className="emergency-phone"
        >
          {siteContent.phonePrimary}
        </a>
      </div>
    </div>
  );
}
