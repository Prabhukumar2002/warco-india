import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { useSiteContent } from "../SiteContentContext";
import { ORG } from "../data/content";

export default function Footer() {
  const { t } = useLanguage();
  const { siteContent } = useSiteContent();
  const year = new Date().getFullYear();

  return (
    <footer className="warco-footer">
      <div className="container py-5">
        <div className="row gy-4">
          <div className="col-12 col-md-4">
            <h3 className="footer-brand">{ORG.name}</h3>
            <p className="footer-fullname">{ORG.fullNameEn}</p>
            <p className="footer-fullname kannada">{ORG.fullNameKn}</p>
            <p className="footer-tagline">{t.footer.tagline}</p>
          </div>

          <div className="col-6 col-md-4">
            <h4 className="footer-heading">{t.footer.quickLinks}</h4>
            <ul className="footer-links">
              <li><Link to="/about">{t.nav.about}</Link></li>
              <li><Link to="/services">{t.nav.services}</Link></li>
              <li><Link to="/awareness">{t.nav.awareness}</Link></li>
              <li><Link to="/training">{t.nav.training}</Link></li>
              <li><Link to="/research">{t.nav.research}</Link></li>
              <li><Link to="/contact">{t.nav.contact}</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <h4 className="footer-heading">{t.footer.getInTouch}</h4>
            <ul className="footer-links">
              <li><a href={`tel:${siteContent.phonePrimary.replace(/\s/g, "")}`}>{siteContent.phonePrimary}</a></li>
              <li><a href={`mailto:${ORG.email}`}>{ORG.email}</a></li>
              <li>{ORG.address}</li>
              <li>{siteContent.statusText}</li>
            </ul>
            <div className="footer-social-links">
              <a href={ORG.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href={ORG.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 8h-2a2 2 0 0 0-2 2v3H9v3h2v6h3v-6h2.2l.8-3H14v-2a1 1 0 0 1 1-1h2V8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <hr className="footer-rule" />
        <p className="footer-bottom">
          © {year} {ORG.name}. {t.footer.rights}
          {" · "}
          <Link to="/admin/login" className="footer-staff-link">
            Staff Login
          </Link>
        </p>
        <p className="footer-credit">
          Developed by{" "}
          <a href="https://your-portfolio-link-here.com" target="_blank" rel="noreferrer">
            Prabhu Kumar P H
          </a>
          {" · "}
          <a href="tel:+919591563335">+91 95915 63335</a>
        </p>
      </div>
    </footer>
  );
}
