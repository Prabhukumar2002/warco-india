const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

function itemShape(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    linkUrl: row.link_url || "",
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

// GET /api/research — public
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM research_items ORDER BY sort_order ASC, created_at DESC");
    res.json(rows.map(itemShape));
  } catch (err) {
    console.error("Get research error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// POST /api/research — admin/editor only
router.post("/", requireAuth, async (req, res) => {
  const { title, description, linkUrl } = req.body || {};
  if (!title) return res.status(400).json({ ok: false, error: "Title is required." });
  try {
    const { rows: countRows } = await pool.query("SELECT COUNT(*)::int AS n FROM research_items");
    const { rows } = await pool.query(
      `INSERT INTO research_items (title, description, link_url, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description || null, linkUrl || null, countRows[0].n]
    );
    res.json({ ok: true, item: itemShape(rows[0]) });
  } catch (err) {
    console.error("Create research item error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// PUT /api/research/:id — admin/editor only
router.put("/:id", requireAuth, async (req, res) => {
  const { title, description, linkUrl } = req.body || {};
  try {
    const { rows } = await pool.query(
      `UPDATE research_items SET
         title       = COALESCE($1, title),
         description = COALESCE($2, description),
         link_url    = COALESCE($3, link_url)
       WHERE id = $4 RETURNING *`,
      [title, description, linkUrl, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ ok: false, error: "Not found." });
    res.json({ ok: true, item: itemShape(rows[0]) });
  } catch (err) {
    console.error("Update research item error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

// DELETE /api/research/:id — admin/editor only
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await pool.query("DELETE FROM research_items WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete research item error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

module.exports = router;
