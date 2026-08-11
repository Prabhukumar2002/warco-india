import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { ORG } from "../data/content";
import { resolveMediaUrl } from "../mediaUrl";

export default function About() {
  const { lang, t } = useLanguage();
  const [research, setResearch] = useState(null);

  useEffect(() => {
    fetch("https://warco-india.onrender.com/api/research")
      .then((r) => r.json())
      .then((data) => setResearch(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setResearch([]));
  }, []);

  const copy = {
    en: {
      title: "About WARCO INDIA",
      p1: `${ORG.fullNameEn} (WARCO INDIA) works across Karnataka to rescue snakes, birds and other wild animals found in homes, farms, factories and construction sites, and to release them safely back into the wild.`,
      p2: "Alongside rescue work, we run structured training programs for anyone whose job puts them face-to-face with wildlife — police control rooms and beat staff, Forest Department teams, municipal bodies, schools, and private companies. Our aim is simple: every encounter should end safely, for the person and for the animal.",
      p3: "We have already trained police personnel and safety teams at private companies across the state, and continue to take on new rescue and training requests.",
      missionTitle: "Our Mission",
      mission: "To reduce human-wildlife conflict through rapid, safe rescue response and practical training — protecting both people and India's snakes, birds and wild animals.",
    },
    kn: {
      title: "WARCO INDIA ಬಗ್ಗೆ",
      p1: `${ORG.fullNameKn} (WARCO INDIA) ಸಂಸ್ಥೆಯು ಕರ್ನಾಟಕದಾದ್ಯಂತ ಮನೆಗಳು, ಜಮೀನುಗಳು, ಕಾರ್ಖಾನೆಗಳು ಮತ್ತು ನಿರ್ಮಾಣ ಸ್ಥಳಗಳಲ್ಲಿ ಕಂಡುಬರುವ ಹಾವು, ಪಕ್ಷಿ ಮತ್ತು ಇತರ ವನ್ಯಜೀವಿಗಳನ್ನು ರಕ್ಷಿಸಿ, ಸುರಕ್ಷಿತವಾಗಿ ಕಾಡಿಗೆ ಮರಳಿ ಬಿಡುಗಡೆ ಮಾಡಲು ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.`,
      p2: "ರಕ್ಷಣಾ ಕಾರ್ಯದ ಜೊತೆಗೆ, ವನ್ಯಜೀವಿಗಳ ಜೊತೆ ನೇರ ಸಂಪರ್ಕಕ್ಕೆ ಬರುವ ಎಲ್ಲರಿಗೂ — ಪೊಲೀಸ್ ಕಂಟ್ರೋಲ್ ರೂಂ ಮತ್ತು ಬೀಟ್ ಸಿಬ್ಬಂದಿ, ಅರಣ್ಯ ಇಲಾಖೆ ತಂಡಗಳು, ಪುರಸಭೆ ಸಂಸ್ಥೆಗಳು, ಶಾಲೆಗಳು ಮತ್ತು ಖಾಸಗಿ ಕಂಪನಿಗಳಿಗೆ — ನಾವು ರಚನಾತ್ಮಕ ತರಬೇತಿ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ನಡೆಸುತ್ತೇವೆ. ನಮ್ಮ ಗುರಿ ಸರಳ: ಪ್ರತಿ ಎದುರಾಗುವಿಕೆಯೂ ವ್ಯಕ್ತಿಗೆ ಮತ್ತು ಪ್ರಾಣಿಗೆ ಸುರಕ್ಷಿತವಾಗಿ ಕೊನೆಗೊಳ್ಳಬೇಕು.",
      p3: "ನಾವು ಈಗಾಗಲೇ ರಾಜ್ಯದಾದ್ಯಂತ ಪೊಲೀಸ್ ಸಿಬ್ಬಂದಿ ಮತ್ತು ಖಾಸಗಿ ಕಂಪನಿಗಳ ಸುರಕ್ಷತಾ ತಂಡಗಳಿಗೆ ತರಬೇತಿ ನೀಡಿದ್ದೇವೆ, ಮತ್ತು ಹೊಸ ರಕ್ಷಣೆ ಮತ್ತು ತರಬೇತಿ ವಿನಂತಿಗಳನ್ನು ಮುಂದುವರಿಸಿ ಸ್ವೀಕರಿಸುತ್ತಿದ್ದೇವೆ.",
      missionTitle: "ನಮ್ಮ ಧ್ಯೇಯ",
      mission: "ತ್ವರಿತ, ಸುರಕ್ಷಿತ ರಕ್ಷಣಾ ಸ್ಪಂದನೆ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ತರಬೇತಿಯ ಮೂಲಕ ಮಾನವ-ವನ್ಯಜೀವಿ ಸಂಘರ್ಷವನ್ನು ಕಡಿಮೆ ಮಾಡುವುದು — ಜನರನ್ನು ಮತ್ತು ಭಾರತದ ಹಾವು, ಪಕ್ಷಿ ಹಾಗೂ ವನ್ಯಜೀವಿಗಳನ್ನು ಒಂದೇ ಸಮಯದಲ್ಲಿ ರಕ್ಷಿಸುವುದು.",
    },
  }[lang];

  return (
    <section className="page-section">
      <div className="container">
        <div className="section-heading">
          <h1>{copy.title}</h1>
        </div>
        <div className="row gy-4">
          <div className="col-12 col-lg-8">
            <p className="lead-copy">{copy.p1}</p>
            <p className="lead-copy">{copy.p2}</p>
            <p className="lead-copy">{copy.p3}</p>
          </div>
          <div className="col-12 col-lg-4">
            <div className="mission-card">
              <h3>{copy.missionTitle}</h3>
              <p>{copy.mission}</p>
            </div>
          </div>
        </div>

        {/* Team photo */}
        <div className="row mt-5 justify-content-center">
          <div className="col-12 col-lg-9">
            <h2 className="subsection-title">{t.about.teamTitle}</h2>
            <div className="training-image">
              <img src={resolveMediaUrl("/uploads/seed-team-photo.jpeg")} alt={t.about.teamTitle} />
            </div>
            <p className="gallery-note mt-2">{t.about.teamCaption}</p>
          </div>
        </div>

        {/* Research preview */}
        {research && research.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <h2 className="subsection-title">{t.about.researchTitle}</h2>
              <div className="row gy-4">
                {research.map((item) => (
                  <div className="col-12 col-md-4" key={item.id}>
                    <div className="research-card">
                      <h3>{item.title}</h3>
                      {item.description && <p>{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/research" className="research-link d-inline-block mt-3">
                {t.about.researchViewAll} →
              </Link>
            </div>
          </div>
        )}

        {/* Connect with us */}
        <div className="row mt-5">
          <div className="col-12">
            <h2 className="subsection-title">{t.about.connectTitle}</h2>
            <div className="about-social-links">
              <a href={ORG.instagram} target="_blank" rel="noreferrer" className="about-social-link">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                {t.about.connectInstagram}
              </a>
              <a href={ORG.facebook} target="_blank" rel="noreferrer" className="about-social-link">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 8h-2a2 2 0 0 0-2 2v3H9v3h2v6h3v-6h2.2l.8-3H14v-2a1 1 0 0 1 1-1h2V8z" />
                </svg>
                {t.about.connectFacebook}
              </a>
              <a href={`mailto:${ORG.email}`} className="about-social-link">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m3 6 9 7 9-7" />
                </svg>
                {ORG.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
