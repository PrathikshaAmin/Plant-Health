const mongoose = require("mongoose");

const uploadedImageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // who uploaded this image
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String, // path/URL to where the file is actually stored
      required: true,
    },
    originalFileName: {
      type: String,
    },
    fileSize: {
      type: Number, // stored in bytes, so we can enforce the 10MB limit
    },
    relatedDiagnosis: {
      type: mongoose.Schema.Types.ObjectId, // optional link to a DiagnosisHistory record
      ref: "DiagnosisHistory",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("UploadedImage", uploadedImageSchema);
