const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// In production, set JWT_SECRET as a real environment variable.
// This fallback exists only so the project runs out of the box for testing.
const JWT_SECRET = process.env.JWT_SECRET || "warco-india-dev-secret-change-me";
const TOKEN_EXPIRY = "12h";

function hashPassword(plain) {
  return bcrypt.hashSync(plain, 10);
}

function verifyPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

function signToken(user) {
  return jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = { hashPassword, verifyPassword, signToken, verifyToken };
