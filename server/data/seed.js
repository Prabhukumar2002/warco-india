const pool = require("../db/pool");
const { hashPassword } = require("../utils/auth");

async function ensureDefaultUsers() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM users");
  if (rows[0].count > 0) return;

  const defaultUsers = [
    { username: "admin", role: "admin", password: "WarcoAdmin@123" },
    { username: "warco", role: "editor", password: "WarcoTeam@123" },
  ];

  for (const u of defaultUsers) {
    await pool.query(
      "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)",
      [u.username, hashPassword(u.password), u.role]
    );
  }//

  console.log("Created default admin accounts in the database:");
  console.log("  admin / WarcoAdmin@123");
  console.log("  warco / WarcoTeam@123");
  console.log("IMPORTANT: log in and change both passwords immediately.");
}

module.exports = { ensureDefaultUsers };
