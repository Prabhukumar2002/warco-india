const { Pool } = require("pg");

// PostgreSQL connection string
//
// Local:
// DATABASE_URL=postgres://postgres:password@localhost:5432/warco_india
//
// Render:
// DATABASE_URL=postgresql://warco_user:password@dpg-xxxxx/warco_india

const connectionString =
  process.env.DATABASE_URL;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString,

  // Render PostgreSQL requires SSL.
  // Local PostgreSQL can run without SSL.
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

// Handle unexpected PostgreSQL errors
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

module.exports = pool;

