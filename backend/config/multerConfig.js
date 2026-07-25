const multer = require("multer");
const path = require("path");

// Where uploaded files get saved, and how they're named
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // saves into your existing uploads/ folder
  },
  filename: (req, file, cb) => {
    // e.g. "1721234567890-leaf.jpg" — timestamp prevents filename collisions
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Only allow JPG/PNG, matching your spec's supported formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG and PNG files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB, matching your spec
});

module.exports = upload;
