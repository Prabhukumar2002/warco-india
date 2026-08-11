const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

function toApiShape(row) {
  return {
    statusText: row.status_text,
    heroQuote: row.hero_quote,
    phonePrimary: row.phone_primary,
    phoneSecondary: row.phone_secondary,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

// GET /api/site-content — public, used by the live site
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM site_content WHERE id = 1");
    res.json(toApiShape(rows[0]));
  } catch (err) {
    console.error("Get site content error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// PUT /api/site-content — admin/editor only
router.put("/", requireAuth, async (req, res) => {
  const { statusText, heroQuote, phonePrimary, phoneSecondary } = req.body || {};

  try {
    const { rows } = await pool.query(
      `UPDATE site_content SET
         status_text     = COALESCE($1, status_text),
         hero_quote      = COALESCE($2, hero_quote),
         phone_primary   = COALESCE($3, phone_primary),
         phone_secondary = COALESCE($4, phone_secondary),
         updated_at      = now(),
         updated_by      = $5
       WHERE id = 1
       RETURNING *`,
      [statusText, heroQuote, phonePrimary, phoneSecondary, req.user.username]
    );

    res.json({ ok: true, content: toApiShape(rows[0]) });
  } catch (err) {
    console.error("Update site content error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

module.exports = router;
