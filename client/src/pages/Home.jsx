import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { useSiteContent } from "../SiteContentContext";
import ProcessTrail from "../components/ProcessTrail";

export default function Home() {
  const { t } = useLanguage();
  const { siteContent } = useSiteContent();

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-12 col-lg-7">
              <p className="hero-eyebrow">{t.hero.eyebrow}</p>
              <h1 className="hero-title">{siteContent.heroQuote || t.hero.title}</h1>
              <p className="hero-subtitle">{t.hero.subtitle}</p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/contact" className="btn btn-warco-cta btn-lg">
                  {t.hero.ctaPrimary}
                </Link>
                <Link to="/training" className="btn btn-warco-outline btn-lg">
                  {t.hero.ctaSecondary}
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-5">
  <div className="d-flex justify-content-center align-items-center">
    <img
      src="/warco.png"
      alt="WARCO"
      className="img-fluid shadow"
      style={{
        width: "300px",
        height: "300px",
        objectFit: "cover",
        border: "6px solid #fff"
      }}
    />
  </div>
</div>
          </div>

          <div className="row gy-4 hero-stats">
            <div className="col-12 col-md-4">
              <div className="stat-card">
                <div className="stat-num">{t.hero.stat1Num}</div>
                <div className="stat-label">{t.hero.stat1Label}</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="stat-card">
                <div className="stat-num">{t.hero.stat2Num}</div>
                <div className="stat-label">{t.hero.stat2Label}</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="stat-card">
                <div className="stat-num">{t.hero.stat3Num}</div>
                <div className="stat-label">{t.hero.stat3Label}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProcessTrail />

      <section className="home-services-preview">
        <div className="container">
          <div className="section-heading">
            <h2>{t.services.title}</h2>
            <p>{t.services.subtitle}</p>
          </div>
          <div className="row gy-4">
            {t.services.items.map((item, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <div className="service-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/services" className="btn btn-warco-outline">
              {t.nav.services}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-training-preview">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-12 col-lg-7">
              <h2>{t.training.title}</h2>
              <p>{t.training.subtitle}</p>
              <p className="trust-note">{t.training.restrictedNote}</p>
              <Link to="/training" className="btn btn-warco-cta">
                {t.training.cta}
              </Link>
            </div>
            <div className="col-12 col-lg-5">
              <ul className="audience-pill-list">
                {t.training.form.departmentOptions.map((label) => (
                  <li key={label} className="audience-pill">
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
