import React, { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import VideoEmbed from "../components/VideoEmbed";
import StackedCarousel from "../components/StackedCarousel";
import { resolveMediaUrl } from "../mediaUrl";

const emptyForm = {
  name: "",
  department: "Police",
  designation: "",
  phone: "",
  email: "",
  location: "",
  preferredDate: "",
  message: "",
};

export default function Training() {
  const { t, lang } = useLanguage();
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://warco-india.onrender.com/api/training")
      .then((r) => r.json())
      .then(setData)
      .catch(() =>
        setData({
          descriptionEn: "",
          descriptionKn: "",
          imageUrl: "",
          videoUrl: "",
          contactPhone: "",
          contactEmail: "",
          images: [],
        })
      );
  }, []);

  const description = data ? (lang === "kn" ? data.descriptionKn : data.descriptionEn) : "";
  const galleryImages = (data && data.images) || [];
  const deptOptions = t.training.form.departmentOptions; // display labels
  const deptValues = ["Police", "Forest", "Army"]; // values sent to API, always in English

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("https://warco-india.onrender.com/api/training/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) throw new Error(result.error || t.training.form.errorMsg);
      setStatus("sent");
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="section-heading">
          <h1>{t.training.title}</h1>
          <p>{t.training.subtitle}</p>
        </div>

        <div className="training-restricted-note">🛡️ {t.training.restrictedNote}</div>

        {galleryImages.length > 0 && (
          <div className="mt-4">
            <h2 className="subsection-title">{t.training.galleryTitle}</h2>
            <StackedCarousel images={galleryImages} />
          </div>
        )}

        <div className="row mt-4 gy-4 align-items-start">
          <div className="col-12 col-lg-7">
            <div className="mission-card">
              <p className="translator-note">🗣️ {t.awareness.translatorNote}</p>
              {description ? (
                <p style={{ whiteSpace: "pre-line" }}>{description}</p>
              ) : (
                data && <p className="text-muted">—</p>
              )}
            </div>

            {data && data.videoUrl && (
              <div className="mt-4">
                <VideoEmbed url={data.videoUrl} />
              </div>
            )}
          </div>

          <div className="col-12 col-lg-5">
            {data && data.imageUrl && (
              <div className="training-image">
                <img src={resolveMediaUrl(data.imageUrl)} alt="Training" />
              </div>
            )}

            <div className="mission-card mt-4">
              <h3>{t.training.contactTitle}</h3>
              {data && data.contactPhone && (
                <p>
                  <a href={`tel:${data.contactPhone.replace(/\s/g, "")}`}>📞 {data.contactPhone}</a>
                </p>
              )}
              {data && data.contactEmail && (
                <p>
                  <a href={`mailto:${data.contactEmail}`}>✉️ {data.contactEmail}</a>
                </p>
              )}
              <button
                type="button"
                className="btn btn-warco-cta mt-2"
                onClick={() => {
                  setShowForm(true);
                  setStatus("idle");
                }}
              >
                {t.training.cta}
              </button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="training-booking-overlay" onClick={() => setShowForm(false)}>
            <div className="training-booking-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="training-booking-close"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h2>{t.training.bookTitle}</h2>

              {status === "sent" ? (
                <p className="form-feedback success mt-3">{t.training.form.successMsg}</p>
              ) : (
                <form onSubmit={handleSubmit} className="admin-form mt-3">
                  <div className="mb-3">
                    <label className="form-label">{t.training.form.name}</label>
                    <input
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t.training.form.department}</label>
                    <select className="form-control" name="department" value={form.department} onChange={handleChange}>
                      {deptValues.map((val, i) => (
                        <option key={val} value={val}>
                          {deptOptions[i]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t.training.form.designation}</label>
                    <input
                      className="form-control"
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t.training.form.phone}</label>
                    <input
                      className="form-control"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t.training.form.email}</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t.training.form.location}</label>
                    <input
                      className="form-control"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t.training.form.preferredDate}</label>
                    <input
                      type="date"
                      className="form-control"
                      name="preferredDate"
                      value={form.preferredDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t.training.form.message}</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-warco-cta" disabled={status === "sending"}>
                    {status === "sending" ? t.training.form.sending : t.training.form.submit}
                  </button>
                  {status === "error" && <p className="form-feedback error mt-2">{error}</p>}
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
