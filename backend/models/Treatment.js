const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
  {
    treatmentName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Chemical", "Organic", "Biological"],
      required: true,
    },
    description: {
      type: String,
    },
    dosage: {
      type: String,
    },
    applicationMethod: {
      type: String,
    },
    disease: {
      type: mongoose.Schema.Types.ObjectId, // links this treatment to one Disease document
      ref: "Disease",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Treatment", treatmentSchema);
