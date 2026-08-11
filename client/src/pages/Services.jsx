import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import VideoEmbed from "../components/VideoEmbed";
import { resolveMediaUrl } from "../mediaUrl";

export default function Services() {
  const { t } = useLanguage();
  const [media, setMedia] = useState(null);

  useEffect(() => {
    fetch("https://warco-india.onrender.com/api/services")
      .then((r) => r.json())
      .then(setMedia)
      .catch(() => setMedia({ imageUrl: "", videoUrl: "" }));
  }, []);

  return (
    <section className="page-section">
      <div className="container">
        <div className="section-heading">
          <h1>{t.services.title}</h1>
          <p>{t.services.subtitle}</p>
        </div>

        {media && media.imageUrl && (
          <div className="row justify-content-center mb-5">
            <div className="col-12 col-lg-9">
              <div className="training-image">
                <img src={resolveMediaUrl(media.imageUrl)} alt={t.services.title} />
              </div>
            </div>
          </div>
        )}

        <div className="row gy-4">
          {t.services.items.map((item, i) => (
            <div className="col-12 col-md-6" key={i}>
              <div className="service-card service-card-lg">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {media && media.videoUrl && (
          <div className="row mt-5 justify-content-center">
            <div className="col-12 col-lg-9">
              <h2 className="subsection-title">{t.services.videoTitle}</h2>
              <VideoEmbed url={media.videoUrl} />
            </div>
          </div>
        )}

        <div className="callout-banner mt-5">
          <p>{t.services.callout}</p>
          <Link to="/contact" className="btn btn-warco-cta">
            {t.nav.emergencyCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
