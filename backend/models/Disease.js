const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema(
  {
    diseaseName: {
      type: String,
      required: true,
      trim: true,
    },
    scientificName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true, // e.g. Fungal, Bacterial, Viral, Pest
      trim: true,
    },
    affectedArea: {
      type: [String], // an array, since a disease can affect multiple areas
      enum: ["Leaf", "Stem", "Root", "Fruit", "Whole Plant"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
    },
    causes: {
      type: String,
    },
    preventionMethods: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Disease", diseaseSchema);
