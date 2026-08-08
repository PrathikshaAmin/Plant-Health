const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadImage,
  getUserImages,
} = require("../controllers/imageController");

// upload.single('image') means: expect ONE file, sent under the field name "image"
router.post("/upload", protect, upload.single("image"), uploadImage);
router.get("/user/:userId", protect, getUserImages);

module.exports = router;
