const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const {
  uploadImage,
  getUserImages,
} = require("../controllers/imageController");

// upload.single('image') means: expect ONE file, sent under the field name "image"
router.post("/upload", upload.single("image"), uploadImage);
router.get("/user/:userId", getUserImages);

module.exports = router;
