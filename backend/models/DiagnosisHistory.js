const mongoose = require("mongoose");

const diagnosisHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // which user ran this diagnosis
      ref: "User",
      required: true,
    },
    symptomsSelected: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Symptom",
      required: true,
    },
    affectedArea: {
      type: String,
      enum: ["Leaf", "Stem", "Root", "Fruit", "Whole Plant"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    suggestedDisease: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Disease",
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt here effectively acts as your "Date" field
  },
);

module.exports = mongoose.model("DiagnosisHistory", diagnosisHistorySchema);
