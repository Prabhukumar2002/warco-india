import React, { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";

export default function Research() {
  const { t } = useLanguage();
  const [items, setItems] = useState(null); // null = loading

  useEffect(() => {
    fetch("https://warco-india.onrender.com/api/research")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <section className="page-section">
      <div className="container">
        <div className="section-heading">
          <h1>{t.research.title}</h1>
          <p>{t.research.subtitle}</p>
        </div>

        {hasItems ? (
          <div className="row gy-4">
            {items.map((item) => (
              <div className="col-12 col-md-6" key={item.id}>
                <div className="research-card">
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                  {item.linkUrl && (
                    <a href={item.linkUrl} target="_blank" rel="noreferrer" className="research-link">
                      {t.research.readMore} →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          items && <p className="gallery-note">{t.research.note}</p>
        )}
      </div>
    </section>
  );
}
