const { verifyToken } = require("../utils/auth");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ ok: false, error: "Not logged in." });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ ok: false, error: "Session expired. Please log in again." });
  }

  req.user = payload; // { username, role }
  next();
}

module.exports = requireAuth;
