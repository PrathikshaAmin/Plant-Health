const Symptom = require("../models/Symptom");

// @desc    Create a new symptom
// @route   POST /api/symptoms
const createSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.create(req.body);
    res.status(201).json(symptom);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all symptoms (optionally filter by affectedArea)
// @route   GET /api/symptoms
const getSymptoms = async (req, res) => {
  try {
    const { affectedArea } = req.query;
    let filter = {};
    if (affectedArea) filter.affectedArea = affectedArea;

    const symptoms = await Symptom.find(filter);
    res.status(200).json(symptoms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single symptom by ID
// @route   GET /api/symptoms/:id
const getSymptomById = async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id);
    if (!symptom) {
      return res.status(404).json({ message: "Symptom not found" });
    }
    res.status(200).json(symptom);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a symptom
// @route   PUT /api/symptoms/:id
const updateSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!symptom) {
      return res.status(404).json({ message: "Symptom not found" });
    }
    res.status(200).json(symptom);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a symptom
// @route   DELETE /api/symptoms/:id
const deleteSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.findByIdAndDelete(req.params.id);
    if (!symptom) {
      return res.status(404).json({ message: "Symptom not found" });
    }
    res.status(200).json({ message: "Symptom deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createSymptom,
  getSymptoms,
  getSymptomById,
  updateSymptom,
  deleteSymptom,
};
