const express = require("express");
const fs = require("fs");
const path = require("path");
const pool = require("../db/pool");
const requireAuth = require("../middleware/requireAuth");
const { imageUpload, UPLOADS_DIR } = require("../utils/upload");

const router = express.Router();

function contentShape(row) {
  return {
    descriptionEn: row.description_en || "",
    descriptionKn: row.description_kn || "",
    videoUrl: row.video_url || "",
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

function imageShape(row) {
  return {
    id: row.id,
    url: row.url||"",
    caption: row.caption || "",
    sortOrder: row.sort_order,
    uploadedAt: row.uploaded_at,
  };
}

// GET /api/awareness — public: description + video + carousel images
router.get("/", async (req, res) => {
  try {
    const [{ rows: contentRows }, { rows: imageRows }] = await Promise.all([
      pool.query("SELECT * FROM awareness_content WHERE id = 1"),
      pool.query("SELECT * FROM awareness_images ORDER BY sort_order ASC, uploaded_at ASC"),
    ]);
    res.json({ ...contentShape(contentRows[0]), images: imageRows.map(imageShape) });
  } catch (err) {
    console.error("Get awareness error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// PUT /api/awareness — admin/editor only: update description + video
router.put("/", requireAuth, async (req, res) => {
  const { descriptionEn, descriptionKn, videoUrl } = req.body || {};
  try {
    const { rows } = await pool.query(
      `UPDATE awareness_content SET
         description_en = COALESCE($1, description_en),
         description_kn = COALESCE($2, description_kn),
         video_url       = COALESCE($3, video_url),
         updated_at      = now(),
         updated_by      = $4
       WHERE id = 1 RETURNING *`,
      [descriptionEn, descriptionKn, videoUrl, req.user.username]
    );
    res.json({ ok: true, content: contentShape(rows[0]) });
  } catch (err) {
    console.error("Update awareness error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// POST /api/awareness/images — admin/editor only, multipart field "image"
router.post("/images", requireAuth, imageUpload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: "No image uploaded." });
  try {
    const url = `/uploads/${req.file.filename}`;
    const { rows: countRows } = await pool.query("SELECT COUNT(*)::int AS n FROM awareness_images");
    const { rows } = await pool.query(
      `INSERT INTO awareness_images (filename, url, caption, sort_order, uploaded_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.file.filename, url, (req.body && req.body.caption) || null, countRows[0].n, req.user.username]
    );
    res.json({ ok: true, item: imageShape(rows[0]) });
  } catch (err) {
    console.error("Upload awareness image error:", err);
    fs.unlink(req.file.path, () => {});
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// DELETE /api/awareness/images/:id — admin/editor only
router.delete("/images/:id", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM awareness_images WHERE id = $1", [req.params.id]);
    const target = rows[0];
    if (!target) return res.status(404).json({ ok: false, error: "Not found." });

    const filePath = path.join(UPLOADS_DIR, target.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query("DELETE FROM awareness_images WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete awareness image error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

module.exports = router;
