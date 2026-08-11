/**
 * Handles the main "Request a Rescue or Training" form and the chat widget —
 * both record a row here, distinguished by request_type.
 *
 * To also receive these by email, install nodemailer (npm install nodemailer)
 * and send a message inside the POST handler below, alongside the DB insert.
 */

const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, phone, email, location, requestType, message } = req.body || {};

  if (!name || !phone || !requestType) {
    return res.status(400).json({
      ok: false,
      error: "Name, phone number and request type are required.",
    });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO submissions (name, phone, email, location, request_type, message)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, phone, email || null, location || null, requestType, message || null]
    );

    console.log("New WARCO INDIA request:", rows[0]);
    res.json({ ok: true, message: "Request received. Our team will contact you shortly." });
  } catch (err) {
    console.error("Contact submission error:", err);
    res.status(500).json({ ok: false, error: "Server error. Please call our helpline directly." });
  }
});

// GET /api/contact — admin/editor only, view submitted requests
router.get("/", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM submissions ORDER BY received_at DESC LIMIT 200");
    res.json(rows);
  } catch (err) {
    console.error("List submissions error:", err);
    res.status(500).json({ ok: false, error: "Server error." });
  }
});

module.exports = router;
