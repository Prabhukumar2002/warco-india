require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const { ensureDefaultUsers } = require("./data/seed");
const contactRouter = require("./routes/contact");
const authRouter = require("./routes/auth");
const siteContentRouter = require("./routes/siteContent");
const awarenessRouter = require("./routes/awareness");
const trainingRouter = require("./routes/training");
const researchRouter = require("./routes/research");
const servicesRouter = require("./routes/services");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Uploaded awareness/training images are served as plain static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", org: "WARCO INDIA" });
});

app.use("/api/contact", contactRouter);
app.use("/api/auth", authRouter);
app.use("/api/site-content", siteContentRouter);
app.use("/api/awareness", awarenessRouter);
app.use("/api/training", trainingRouter);
app.use("/api/research", researchRouter);
app.use("/api/services", servicesRouter);

async function start() {
  try {
    await ensureDefaultUsers();
  } catch (err) {
    console.error(
      "Could not connect to PostgreSQL. Is it running, and does the database exist?\n" +
        "See server/README.md for setup steps.\n",
      err.message
    );
    process.exit(1);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WARCO INDIA API running on http://localhost:${PORT}`);
  });
  // app.listen(PORT, () => {
  //   console.log(`WARCO INDIA API running on http://localhost:${PORT}`);
  // });
}

start();
