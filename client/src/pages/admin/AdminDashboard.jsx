import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { resolveMediaUrl } from "../../mediaUrl";

const TABS = ["Site Content", "Awareness", "Training", "Services", "Research", "Change Password"];

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Logged in as <strong>{user?.username}</strong> ({user?.role})
            </p>
          </div>
          <button className="btn btn-warco-outline" onClick={logout}>
            Log Out
          </button>
        </div>

        <div className="admin-tabs">
          {TABS.map((name) => (
            <button
              key={name}
              className={"admin-tab" + (tab === name ? " active" : "")}
              onClick={() => setTab(name)}
              type="button"
            >
              {name}
            </button>
          ))}
        </div>

        <div className="admin-panel">
          {tab === "Site Content" && <SiteContentTab token={token} />}
          {tab === "Awareness" && <AwarenessTab token={token} />}
          {tab === "Training" && <TrainingTab token={token} />}
          {tab === "Services" && <ServicesTab token={token} />}
          {tab === "Research" && <ResearchTab token={token} />}
          {tab === "Change Password" && <ChangePasswordTab token={token} />}
        </div>
      </div>
    </div>
  );
}

function SiteContentTab({ token }) {
  const [form, setForm] = useState({ statusText: "", heroQuote: "", phonePrimary: "", phoneSecondary: "" });
  const [status, setStatus] = useState("loading"); // loading | idle | saving | saved | error
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://warco-india.onrender.com/api/site-content")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          statusText: data.statusText || "",
          heroQuote: data.heroQuote || "",
          phonePrimary: data.phonePrimary || "",
          phoneSecondary: data.phoneSecondary || "",
        });
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("https://warco-india.onrender.com/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  if (status === "loading") return <p>Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <p className="admin-form-hint">
        These changes appear live on the public site — the "24×7 Active" badge, the hero
        headline, and the phone numbers shown in the emergency bar, contact page and footer.
      </p>
      <div className="mb-3">
        <label className="form-label">Status badge text</label>
        <input className="form-control" name="statusText" value={form.statusText} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Hero quote / headline</label>
        <textarea className="form-control" rows="2" name="heroQuote" value={form.heroQuote} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Primary phone number</label>
        <input className="form-control" name="phonePrimary" value={form.phonePrimary} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Secondary / WhatsApp phone number</label>
        <input className="form-control" name="phoneSecondary" value={form.phoneSecondary} onChange={handleChange} />
      </div>
      <button type="submit" className="btn btn-warco-cta" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Save Changes"}
      </button>
      {status === "saved" && <p className="form-feedback success mt-2">Saved.</p>}
      {status === "error" && <p className="form-feedback error mt-2">{error}</p>}
    </form>
  );
}

function AwarenessTab({ token }) {
  const [form, setForm] = useState({ descriptionEn: "", descriptionKn: "", videoUrl: "" });
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState("loading");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    fetch("https://warco-india.onrender.com/api/awareness")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          descriptionEn: data.descriptionEn || "",
          descriptionKn: data.descriptionKn || "",
          videoUrl: data.videoUrl || "",
        });
        setImages(data.images || []);
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("https://warco-india.onrender.com/api/awareness", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption);
      const res = await fetch("https://warco-india.onrender.com/api/awareness/images", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Upload failed.");
      setFile(null);
      setCaption("");
      e.target.reset && e.target.reset();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await fetch(`https://warco-india.onrender.com/api/awareness/images/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      load();
    } catch {
      setError("Could not delete image.");
    }
  };

  if (status === "loading") return <p>Loading…</p>;

  return (
    <div>
      <h2 className="admin-section-title">Description &amp; Video</h2>
      <form onSubmit={handleSubmit} className="admin-form mb-5">
        <p className="admin-form-hint">
          Shown on the public Awareness page, below the image carousel. Explain the village/school
          snake-awareness sessions delivered with a translator.
        </p>
        <div className="mb-3">
          <label className="form-label">Description (English)</label>
          <textarea
            className="form-control"
            rows="5"
            name="descriptionEn"
            value={form.descriptionEn}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description (Kannada)</label>
          <textarea
            className="form-control"
            rows="5"
            name="descriptionKn"
            value={form.descriptionKn}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Video URL (YouTube, Vimeo, or direct video link)</label>
          <input className="form-control" name="videoUrl" value={form.videoUrl} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-warco-cta" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save Changes"}
        </button>
        {status === "saved" && <p className="form-feedback success mt-2">Saved.</p>}
        {status === "error" && <p className="form-feedback error mt-2">{error}</p>}
      </form>

      <h2 className="admin-section-title">Carousel Images</h2>
      <form onSubmit={handleUpload} className="admin-form mb-4">
        <p className="admin-form-hint">JPG, PNG or WEBP, up to 5MB. Appears in the stacked carousel on the Awareness page.</p>
        <div className="mb-3">
          <label className="form-label">Image file</label>
          <input
            type="file"
            className="form-control"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Caption (optional)</label>
          <input className="form-control" value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-warco-cta" disabled={!file || uploading}>
          {uploading ? "Uploading…" : "Upload Image"}
        </button>
      </form>

      <div className="admin-gallery-grid">
        {images.length === 0 && <p>No images uploaded yet.</p>}
        {images.map((item) => (
          <div className="admin-gallery-item" key={item.id}>
            <img src={resolveMediaUrl(item.url)} alt={item.caption || "Awareness upload"} />
            {item.caption && <p>{item.caption}</p>}
            <button className="btn btn-warco-outline btn-sm" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrainingTab({ token }) {
  const [form, setForm] = useState({
    descriptionEn: "",
    descriptionKn: "",
    videoUrl: "",
    contactPhone: "",
    contactEmail: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryCaption, setGalleryCaption] = useState("");
  const [galleryUploading, setGalleryUploading] = useState(false);

  const load = () => {
    fetch("https://warco-india.onrender.com/api/training")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          descriptionEn: data.descriptionEn || "",
          descriptionKn: data.descriptionKn || "",
          videoUrl: data.videoUrl || "",
          contactPhone: data.contactPhone || "",
          contactEmail: data.contactEmail || "",
        });
        setImageUrl(data.imageUrl || "");
        setGallery(data.images || []);
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  };

  const loadBookings = () => {
    fetch("https://warco-india.onrender.com/api/training/bookings", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  useEffect(() => {
    load();
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("https://warco-india.onrender.com/api/training", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("https://warco-india.onrender.com/api/training/image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Upload failed.");
      setImageUrl(data.content.imageUrl);
      setFile(null);
      e.target.reset && e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (!galleryFile) return;
    setGalleryUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", galleryFile);
      formData.append("caption", galleryCaption);
      const res = await fetch("https://warco-india.onrender.com/api/training/images", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Upload failed.");
      setGalleryFile(null);
      setGalleryCaption("");
      e.target.reset && e.target.reset();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleGalleryDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await fetch(`https://warco-india.onrender.com/api/training/images/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      load();
    } catch {
      setError("Could not delete image.");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`https://warco-india.onrender.com/api/training/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      loadBookings();
    } catch {
      // ignore
    }
  };

  if (status === "loading") return <p>Loading…</p>;

  return (
    <div>
      <h2 className="admin-section-title">Description, Media &amp; Contact</h2>
      <form onSubmit={handleSubmit} className="admin-form mb-4">
        <p className="admin-form-hint">
          Training is restricted to Police, Forest Department and Army personnel. Explain the
          programme here — it's shown with a translator note on the public Training page.
        </p>
        <div className="mb-3">
          <label className="form-label">Description (English)</label>
          <textarea
            className="form-control"
            rows="5"
            name="descriptionEn"
            value={form.descriptionEn}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description (Kannada)</label>
          <textarea
            className="form-control"
            rows="5"
            name="descriptionKn"
            value={form.descriptionKn}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Video URL (YouTube, Vimeo, or direct video link)</label>
          <input className="form-control" name="videoUrl" value={form.videoUrl} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact phone (for training enquiries)</label>
          <input className="form-control" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact email (for training enquiries)</label>
          <input className="form-control" name="contactEmail" value={form.contactEmail} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-warco-cta" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save Changes"}
        </button>
        {status === "saved" && <p className="form-feedback success mt-2">Saved.</p>}
        {status === "error" && <p className="form-feedback error mt-2">{error}</p>}
      </form>

      <form onSubmit={handleImageUpload} className="admin-form mb-5">
        <p className="admin-form-hint">One image shown alongside the training description. Uploading a new one replaces it.</p>
        {imageUrl && (
          <div className="admin-gallery-item mb-3" style={{ maxWidth: 260 }}>
            <img src={resolveMediaUrl(imageUrl)} alt="Training" />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Image file</label>
          <input
            type="file"
            className="form-control"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-warco-cta" disabled={!file || uploading}>
          {uploading ? "Uploading…" : "Upload / Replace Image"}
        </button>
      </form>

      <h2 className="admin-section-title">Training Photo Gallery</h2>
      <form onSubmit={handleGalleryUpload} className="admin-form mb-4">
        <p className="admin-form-hint">
          JPG, PNG or WEBP, up to 5MB. Appears as a photo carousel on the public Training page.
        </p>
        <div className="mb-3">
          <label className="form-label">Image file</label>
          <input
            type="file"
            className="form-control"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setGalleryFile(e.target.files[0])}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Caption (optional)</label>
          <input className="form-control" value={galleryCaption} onChange={(e) => setGalleryCaption(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-warco-cta" disabled={!galleryFile || galleryUploading}>
          {galleryUploading ? "Uploading…" : "Upload Image"}
        </button>
      </form>

      <div className="admin-gallery-grid mb-5">
        {gallery.length === 0 && <p>No gallery images uploaded yet.</p>}
        {gallery.map((item) => (
          <div className="admin-gallery-item" key={item.id}>
            <img src={resolveMediaUrl(item.url)} alt={item.caption || "Training upload"} />
            {item.caption && <p>{item.caption}</p>}
            <button className="btn btn-warco-outline btn-sm" onClick={() => handleGalleryDelete(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <h2 className="admin-section-title">Training Bookings</h2>
      <p className="admin-form-hint">
        New bookings are emailed to WARCO's admin inbox automatically (once SMTP is configured in
        server/.env) and always appear here.
      </p>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Received</th>
              <th>Name</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan="6">No bookings yet.</td>
              </tr>
            )}
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{new Date(b.receivedAt).toLocaleString("en-IN")}</td>
                <td>{b.name}{b.designation ? ` (${b.designation})` : ""}</td>
                <td>{b.department}</td>
                <td>
                  <a href={`tel:${b.phone}`}>{b.phone}</a>
                  {b.email && (
                    <>
                      <br />
                      <a href={`mailto:${b.email}`}>{b.email}</a>
                    </>
                  )}
                </td>
                <td>{b.location}</td>
                <td>
                  <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="done">Done</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ServicesTab({ token }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const load = () => {
    fetch("https://warco-india.onrender.com/api/services")
      .then((r) => r.json())
      .then((data) => {
        setVideoUrl(data.videoUrl || "");
        setImageUrl(data.imageUrl || "");
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("https://warco-india.onrender.com/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ videoUrl }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("https://warco-india.onrender.com/api/services/image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Upload failed.");
      setImageUrl(data.content.imageUrl);
      setFile(null);
      e.target.reset && e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (status === "loading") return <p>Loading…</p>;

  return (
    <div>
      <h2 className="admin-section-title">Rescue Services — Video</h2>
      <form onSubmit={handleSubmit} className="admin-form mb-4">
        <p className="admin-form-hint">
          Shown on the public Rescue Services page, below the service cards.
        </p>
        <div className="mb-3">
          <label className="form-label">Video URL (YouTube, Vimeo, or direct video link)</label>
          <input className="form-control" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-warco-cta" disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save Changes"}
        </button>
        {status === "saved" && <p className="form-feedback success mt-2">Saved.</p>}
        {status === "error" && <p className="form-feedback error mt-2">{error}</p>}
      </form>

      <h2 className="admin-section-title">Rescue Services — Hero Image</h2>
      <form onSubmit={handleImageUpload} className="admin-form mb-5">
        <p className="admin-form-hint">One image shown at the top of the Rescue Services page. Uploading a new one replaces it.</p>
        {imageUrl && (
          <div className="admin-gallery-item mb-3" style={{ maxWidth: 260 }}>
            <img src={resolveMediaUrl(imageUrl)} alt="Rescue Services" />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Image file</label>
          <input
            type="file"
            className="form-control"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-warco-cta" disabled={!file || uploading}>
          {uploading ? "Uploading…" : "Upload / Replace Image"}
        </button>
      </form>
    </div>
  );
}

function ResearchTab({ token }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", linkUrl: "" });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const load = () => {
    fetch("https://warco-india.onrender.com/api/research")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setError("");
    try {
      const res = await fetch("https://warco-india.onrender.com/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not add item.");
      setForm({ title: "", description: "", linkUrl: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this research item?")) return;
    try {
      await fetch(`https://warco-india.onrender.com/api/research/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      load();
    } catch {
      setError("Could not delete item.");
    }
  };

  if (status === "loading") return <p>Loading…</p>;

  return (
    <div>
      <h2 className="admin-section-title">Add Research Item</h2>
      <form onSubmit={handleSubmit} className="admin-form mb-5">
        <p className="admin-form-hint">A small title + description card, shown on the public Research page.</p>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="3" name="description" value={form.description} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Link (optional — publication, PDF, article)</label>
          <input className="form-control" name="linkUrl" value={form.linkUrl} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-warco-cta">
          Add Item
        </button>
        {error && <p className="form-feedback error mt-2">{error}</p>}
      </form>

      <h2 className="admin-section-title">Existing Items</h2>
      {items.length === 0 && <p>No research items yet.</p>}
      <div className="admin-research-list">
        {items.map((item) => (
          <div className="admin-research-item" key={item.id}>
            <div>
              <h4>{item.title}</h4>
              {item.description && <p>{item.description}</p>}
              {item.linkUrl && (
                <a href={item.linkUrl} target="_blank" rel="noreferrer">
                  {item.linkUrl}
                </a>
              )}
            </div>
            <button className="btn btn-warco-outline btn-sm" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChangePasswordTab({ token }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("https://warco-india.onrender.com/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not change password.");
      setStatus("saved");
      setMessage("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="mb-3">
        <label className="form-label">Current password</label>
        <input
          type="password"
          className="form-control"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">New password (min. 8 characters)</label>
        <input
          type="password"
          className="form-control"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          required
        />
      </div>
      <button type="submit" className="btn btn-warco-cta" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Change Password"}
      </button>
      {message && (
        <p className={"form-feedback mt-2 " + (status === "error" ? "error" : "success")}>{message}</p>
      )}
    </form>
  );
}
