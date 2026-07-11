const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema(
  {
    symptomName: {
      type: String,
      required: true,
      trim: true,
      unique: true, // avoid duplicate symptoms like "Yellowing" being added twice
    },
    description: {
      type: String,
    },
    affectedArea: {
      type: String,
      enum: ["Leaf", "Stem", "Root", "Fruit", "Whole Plant"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Symptom", symptomSchema);
