import React, { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import StackedCarousel from "../components/StackedCarousel";
import VideoEmbed from "../components/VideoEmbed";

export default function Awareness() {
  const { t, lang } = useLanguage();
  const [data, setData] = useState(null); // null = loading

  useEffect(() => {
    fetch("https://warco-india.onrender.com/api/awareness")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ images: [], descriptionEn: "", descriptionKn: "", videoUrl: "" }));
  }, []);

  const description = data ? (lang === "kn" ? data.descriptionKn : data.descriptionEn) : "";
  const images = (data && data.images) || [];

  return (
    <section className="page-section">
      <div className="container">
        <div className="section-heading">
          <h1>{t.awareness.title}</h1>
          <p>{t.awareness.subtitle}</p>
        </div>

        {images.length > 0 ? (
          <StackedCarousel images={images} />
        ) : (
          data && <p className="gallery-note">{t.awareness.noImagesNote}</p>
        )}

        <div className="row mt-5 justify-content-center">
          <div className="col-12 col-lg-9">
            <div className="mission-card awareness-description">
              <p className="translator-note">🗣️ {t.awareness.translatorNote}</p>
              {description ? (
                <p style={{ whiteSpace: "pre-line" }}>{description}</p>
              ) : (
                data && <p className="text-muted">—</p>
              )}
            </div>
          </div>
        </div>

        {data && data.videoUrl && (
          <div className="row mt-5 justify-content-center">
            <div className="col-12 col-lg-9">
              <h2 className="subsection-title">{t.awareness.videoTitle}</h2>
              <VideoEmbed url={data.videoUrl} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
