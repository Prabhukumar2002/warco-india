import React from "react";
import { useLanguage } from "../LanguageContext";

// A winding trail (evoking a snake's path) linking the four real, ordered
// steps of a rescue. This is a genuine sequence, so the numbering/order
// carries real information rather than decorating the section.
export default function ProcessTrail() {
  const { t } = useLanguage();
  const steps = t.trail.steps;

  return (
    <section className="process-trail-section">
      <div className="container">
        <div className="section-heading">
          <h2>{t.trail.title}</h2>
          <p>{t.trail.subtitle}</p>
        </div>

        <div className="trail-wrap">
          <svg
            className="trail-svg d-none d-lg-block"
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M40,60 C160,10 260,110 380,60 C500,10 600,110 720,60 C800,25 880,90 960,60"
              stroke="var(--warco-amber)"
              strokeWidth="3"
              strokeDasharray="1 14"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          <div className="row gy-4">
            {steps.map((step, i) => (
              <div className="col-12 col-md-6 col-lg-3" key={i}>
                <div className="trail-step">
                  <div className="trail-index">{String(i + 1).padStart(2, "0")}</div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
