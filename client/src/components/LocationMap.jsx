import React from "react";
import { useLanguage } from "../LanguageContext";
import { ORG } from "../data/content";

// Uses Google Maps' key-free embed endpoint. Replace the query below with
// your exact office address once you have one, for a precise pin instead
// of a general area view.
export default function LocationMap() {
  const { t } = useLanguage();
  const query = encodeURIComponent(ORG.address);

  return (
    <section className="location-map-section">
      <div className="container">
        <div className="section-heading">
          <h2>{t.map.title}</h2>
          <p>{t.map.subtitle}</p>
        </div>
        <div className="map-embed-wrap">
          <iframe
            title="WARCO INDIA service area map"
            src={`https://www.google.com/maps?q=${query}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
