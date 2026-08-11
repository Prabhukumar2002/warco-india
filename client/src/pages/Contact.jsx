import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { useSiteContent } from "../SiteContentContext";
import { ORG } from "../data/content";
import LocationMap from "../components/LocationMap";

// In development, CRA's package.json can add a "proxy" field pointing at
// http://localhost:5000 so this relative path just works. See client/README
// note in the main README for the one-line addition.
const API_URL = "https://warco-india.onrender.com/api/contact";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  location: "",
  requestType: "",
  message: "",
};

export default function Contact() {
  const { t } = useLanguage();
  const { siteContent } = useSiteContent();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="section-heading">
          <h1>{t.contact.title}</h1>
          <p>{t.contact.subtitle}</p>
        </div>

        <div className="row gy-5">
          <div className="col-12 col-lg-7">
            <div className="contact-form-card">
              <h2>{t.contact.formTitle}</h2>
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">{t.contact.name}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">{t.contact.phone}</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">{t.contact.email}</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">{t.contact.location}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">{t.contact.requestType}</label>
                    <select
                      className="form-select"
                      name="requestType"
                      value={form.requestType}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        —
                      </option>
                      {t.contact.requestOptions.map((opt) => (
                        <option value={opt} key={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">{t.contact.message}</label>
                    <textarea
                      className="form-control"
                      name="message"
                      rows="4"
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-warco-cta btn-lg mt-4"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? t.contact.sending : t.contact.submit}
                </button>

                {status === "success" && (
                  <p className="form-feedback success mt-3">{t.contact.successMsg}</p>
                )}
                {status === "error" && (
                  <p className="form-feedback error mt-3">{t.contact.errorMsg}</p>
                )}
              </form>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="quick-contact-card">
              <h3>{t.contact.quickContact}</h3>
              <ul className="quick-contact-list">
                <li>
                  <span className="qc-label">{t.contact.call}</span>
                  <a href={`tel:${siteContent.phonePrimary.replace(/\s/g, "")}`}>{siteContent.phonePrimary}</a>
                </li>
                <li>
                  <span className="qc-label">{t.contact.whatsapp}</span>
                  <a
                    href={`https://wa.me/${ORG.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {siteContent.phoneSecondary}
                  </a>
                </li>
                <li>
                  <span className="qc-label">{t.contact.writeToUs}</span>
                  <a href={`mailto:${ORG.email}`}>{ORG.email}</a>
                </li>
                <li>
                  <span className="qc-label">{t.contact.officeHours}</span>
                  <span>{siteContent.statusText}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LocationMap />
    </section>
  );
}
