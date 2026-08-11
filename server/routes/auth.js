const express = require("express");
const pool = require("../db/pool");
const { verifyPassword, hashPassword, signToken } = require("../utils/auth");
const requireAuth = require("../middleware/requireAuth");
const ipAllowlist = require("../middleware/ipAllowlist");

const router = express.Router();

// POST /api/auth/login
router.post("/login", ipAllowlist, async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ ok: false, error: "Username and password required." });
  }

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = rows[0];

    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ ok: false, error: "Incorrect username or password." });
    }

    const token = signToken({ username: user.username, role: user.role });
    res.json({ ok: true, token, username: user.username, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ ok: false, error: "Server error. Please try again." });
  }
});

// GET /api/auth/me — used by the front end to check if a stored token is still valid
router.get("/me", requireAuth, (req, res) => {
  res.json({ ok: true, username: req.user.username, role: req.user.role });
});

// POST /api/auth/change-password  { currentPassword, newPassword }
router.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ ok: false, error: "Current and new password required." });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ ok: false, error: "New password must be at least 8 characters." });
  }

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [req.user.username]);
    const user = rows[0];

    if (!user || !verifyPassword(currentPassword, user.password_hash)) {
      return res.status(401).json({ ok: false, error: "Current password is incorrect." });
    }

    await pool.query("UPDATE users SET password_hash = $1 WHERE username = $2", [
      hashPassword(newPassword),
      req.user.username,
    ]);

    res.json({ ok: true, message: "Password updated." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ ok: false, error: "Server error. Please try again." });
  }
});

module.exports = router;
