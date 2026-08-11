const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/requireAuth");
const { imageUpload } = require("../utils/upload");

const router = express.Router();

function contentShape(row) {
  return {
    imageUrl: row.image_url || "",
    videoUrl: row.video_url || "",
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

// GET /api/services — public: hero image + video shown on the Rescue Services page
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM services_content WHERE id = 1");
    res.json(contentShape(rows[0]));
  } catch (err) {
    console.error("Get services content error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// PUT /api/services — admin/editor only: update video URL
router.put("/", requireAuth, async (req, res) => {
  const { videoUrl } = req.body || {};
  try {
    const { rows } = await pool.query(
      `UPDATE services_content SET
         video_url  = COALESCE($1, video_url),
         updated_at = now(),
         updated_by = $2
       WHERE id = 1 RETURNING *`,
      [videoUrl, req.user.username]
    );
    res.json({ ok: true, content: contentShape(rows[0]) });
  } catch (err) {
    console.error("Update services content error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// POST /api/services/image — admin/editor only, multipart field "image"
router.post("/image", requireAuth, imageUpload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: "No image uploaded." });
  try {
    const url = `/uploads/${req.file.filename}`;
    const { rows } = await pool.query(
      `UPDATE services_content SET image_url = $1, updated_at = now(), updated_by = $2
       WHERE id = 1 RETURNING *`,
      [url, req.user.username]
    );
    res.json({ ok: true, content: contentShape(rows[0]) });
  } catch (err) {
    console.error("Upload services image error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

module.exports = router;
