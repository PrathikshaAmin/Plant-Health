const UploadedImage = require("../models/UploadedImage");

// @desc    Upload an image
// @route   POST /api/images/upload
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const { userId, relatedDiagnosis } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const image = await UploadedImage.create({
      user: userId,
      imageUrl: `/uploads/${req.file.filename}`,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      relatedDiagnosis: relatedDiagnosis || undefined,
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all images for a specific user
// @route   GET /api/images/user/:userId
const getUserImages = async (req, res) => {
  try {
    const images = await UploadedImage.find({ user: req.params.userId });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { uploadImage, getUserImages };
