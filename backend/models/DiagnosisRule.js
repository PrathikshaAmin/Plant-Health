const mongoose = require("mongoose");

const diagnosisRuleSchema = new mongoose.Schema(
  {
    affectedArea: {
      type: String,
      enum: ["Leaf", "Stem", "Root", "Fruit", "Whole Plant"],
      required: true,
    },
    symptoms: {
      type: [mongoose.Schema.Types.ObjectId], // a rule can require multiple symptoms
      ref: "Symptom",
      required: true,
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    disease: {
      type: mongoose.Schema.Types.ObjectId, // the disease this rule points to
      ref: "Disease",
      required: true,
    },
    matchScore: {
      type: Number, // e.g. 85 (meaning 85%)
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("DiagnosisRule", diagnosisRuleSchema);
