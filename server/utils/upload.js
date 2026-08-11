const fs = require("fs");
const path = require("path");
const multer = require("multer");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${safeExt}`);
  },
});

const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = /image\/(jpeg|png|webp)/.test(file.mimetype);
    cb(ok ? null : new Error("Only JPG, PNG or WEBP images are allowed."), ok);
  },
});

module.exports = { imageUpload, UPLOADS_DIR };
