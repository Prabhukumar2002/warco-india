import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { useTheme } from "../ThemeContext";
import { ORG } from "../data/content";

export default function Navbar() {
  const { t, lang, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes (tapping a link) so it
  // never gets stuck open on phones/tablets.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close the mobile menu if the window is resized up to desktop width,
  // so switching from portrait phone to a wider view never leaves it stuck.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <nav className="navbar navbar-expand-lg warco-navbar sticky-top">
      <div className="container">
        <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img src="/logo.jpg" alt="WARCO INDIA logo" className="brand-logo" />
          <span className="brand-text">{ORG.name}</span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="warcoNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={"collapse navbar-collapse" + (menuOpen ? " show" : "")} id="warcoNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li className="nav-item">
              <NavLink to="/" className={linkClass} end>
                {t.nav.home}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className={linkClass}>
                {t.nav.about}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/services" className={linkClass}>
                {t.nav.services}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/awareness" className={linkClass}>
                {t.nav.awareness}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/training" className={linkClass}>
                {t.nav.training}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/research" className={linkClass}>
                {t.nav.research}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className={linkClass}>
                {t.nav.contact}
              </NavLink>
            </li>
            <li className="nav-item ms-lg-2 my-2 my-lg-0">
              <button className="btn btn-lang" onClick={toggleLanguage} type="button">
                {lang === "en" ? "ಕನ್ನಡ" : "English"}
              </button>
            </li>
            <li className="nav-item ms-lg-2 my-2 my-lg-0">
              <button
                className="btn btn-theme-toggle"
                onClick={toggleTheme}
                type="button"
                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              >
                {theme === "light" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.55 1.55M18.25 18.25l1.55 1.55M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.55-1.55M18.25 5.75l1.55-1.55"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </li>
            <li className="nav-item ms-lg-2">
              <NavLink to="/contact" className="btn btn-warco-cta">
                {t.nav.emergencyCta}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
