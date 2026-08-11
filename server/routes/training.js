const express = require("express");
const fs = require("fs");
const path = require("path");
const pool = require("../db/pool");
const requireAuth = require("../middleware/requireAuth");
const { imageUpload, UPLOADS_DIR } = require("../utils/upload");
const { sendBookingNotification } = require("../utils/notify");

const router = express.Router();

const ALLOWED_DEPARTMENTS = ["Police", "Forest", "Army"];

function contentShape(row) {
  return {
    descriptionEn: row.description_en || "",
    descriptionKn: row.description_kn || "",
    imageUrl: row.image_url || "",
    videoUrl: row.video_url || "",
    contactPhone: row.contact_phone || "",
    contactEmail: row.contact_email || "",
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

function galleryImageShape(row) {
  return {
    id: row.id,
    url: row.url,
    caption: row.caption || "",
    sortOrder: row.sort_order,
    uploadedAt: row.uploaded_at,
  };
}

function bookingShape(row) {
  return {
    id: row.id,
    name: row.name,
    department: row.department,
    designation: row.designation || "",
    phone: row.phone,
    email: row.email || "",
    location: row.location || "",
    preferredDate: row.preferred_date,
    message: row.message || "",
    status: row.status,
    receivedAt: row.received_at,
  };
}

// GET /api/training — public (includes the training photo gallery)
router.get("/", async (req, res) => {
  try {
    const [{ rows: contentRows }, { rows: imageRows }] = await Promise.all([
      pool.query("SELECT * FROM training_content WHERE id = 1"),
      pool.query("SELECT * FROM training_images ORDER BY sort_order ASC, uploaded_at ASC"),
    ]);
    res.json({ ...contentShape(contentRows[0]), images: imageRows.map(galleryImageShape) });
  } catch (err) {
    console.error("Get training content error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// PUT /api/training — admin/editor only: description, video url, contact info
router.put("/", requireAuth, async (req, res) => {
  const { descriptionEn, descriptionKn, videoUrl, contactPhone, contactEmail } = req.body || {};
  try {
    const { rows } = await pool.query(
      `UPDATE training_content SET
         description_en = COALESCE($1, description_en),
         description_kn = COALESCE($2, description_kn),
         video_url       = COALESCE($3, video_url),
         contact_phone   = COALESCE($4, contact_phone),
         contact_email   = COALESCE($5, contact_email),
         updated_at      = now(),
         updated_by      = $6
       WHERE id = 1 RETURNING *`,
      [descriptionEn, descriptionKn, videoUrl, contactPhone, contactEmail, req.user.username]
    );
    res.json({ ok: true, content: contentShape(rows[0]) });
  } catch (err) {
    console.error("Update training content error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// POST /api/training/image — admin/editor only, multipart field "image"
router.post("/image", requireAuth, imageUpload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: "No image uploaded." });
  try {
    const url = `/uploads/${req.file.filename}`;
    const { rows } = await pool.query(
      `UPDATE training_content SET image_url = $1, updated_at = now(), updated_by = $2
       WHERE id = 1 RETURNING *`,
      [url, req.user.username]
    );
    res.json({ ok: true, content: contentShape(rows[0]) });
  } catch (err) {
    console.error("Upload training image error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// POST /api/training/images — admin/editor only, multipart field "image"
// Adds a photo to the training gallery (separate from the single contact-card image above).
router.post("/images", requireAuth, imageUpload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: "No image uploaded." });
  try {
    const url = `/uploads/${req.file.filename}`;
    const { rows: countRows } = await pool.query("SELECT COUNT(*)::int AS n FROM training_images");
    const { rows } = await pool.query(
      `INSERT INTO training_images (filename, url, caption, sort_order, uploaded_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.file.filename, url, (req.body && req.body.caption) || null, countRows[0].n, req.user.username]
    );
    res.json({ ok: true, item: galleryImageShape(rows[0]) });
  } catch (err) {
    console.error("Upload training gallery image error:", err);
    fs.unlink(req.file.path, () => {});
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// DELETE /api/training/images/:id — admin/editor only
router.delete("/images/:id", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM training_images WHERE id = $1", [req.params.id]);
    const target = rows[0];
    if (!target) return res.status(404).json({ ok: false, error: "Not found." });

    const filePath = path.join(UPLOADS_DIR, target.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query("DELETE FROM training_images WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete training gallery image error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// POST /api/training/book — public: Police / Forest / Army only
router.post("/book", async (req, res) => {
  const { name, department, designation, phone, email, location, preferredDate, message } = req.body || {};

  if (!name || !department || !phone) {
    return res.status(400).json({ ok: false, error: "Name, department and phone number are required." });
  }
  if (!ALLOWED_DEPARTMENTS.includes(department)) {
    return res.status(400).json({
      ok: false,
      error: "Training bookings are only available for Police, Forest Department or Army personnel.",
    });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO training_bookings (name, department, designation, phone, email, location, preferred_date, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, department, designation || null, phone, email || null, location || null, preferredDate || null, message || null]
    );
    const booking = bookingShape(rows[0]);

    // Fire-and-forget: don't make the visitor wait on email/WhatsApp delivery
    sendBookingNotification(booking).catch((err) => console.error("Notify error:", err));

    res.json({ ok: true, message: "Booking received. Our team will contact you shortly.", booking });
  } catch (err) {
    console.error("Training booking error:", err);
    res.status(500).json({ ok: false, error: "Server error. Please call us directly." });
  }
});

// GET /api/training/bookings — admin/editor only
router.get("/bookings", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM training_bookings ORDER BY received_at DESC LIMIT 200");
    res.json(rows.map(bookingShape));
  } catch (err) {
    console.error("List training bookings error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// PUT /api/training/bookings/:id — admin/editor only: update status
router.put("/bookings/:id", requireAuth, async (req, res) => {
  const { status } = req.body || {};
  try {
    const { rows } = await pool.query(
      "UPDATE training_bookings SET status = COALESCE($1, status) WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ ok: false, error: "Not found." });
    res.json({ ok: true, booking: bookingShape(rows[0]) });
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

module.exports = router;
