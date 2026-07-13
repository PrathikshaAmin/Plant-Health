const Disease = require("../models/Disease");

// @desc    Create a new disease
// @route   POST /api/diseases
const createDisease = async (req, res) => {
  try {
    const disease = await Disease.create(req.body);
    res.status(201).json(disease);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all diseases (supports search by name/symptom, filter by category/area)
// @route   GET /api/diseases
const getDiseases = async (req, res) => {
  try {
    const { search, category, affectedArea } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { diseaseName: { $regex: search, $options: "i" } },
        { symptoms: { $regex: search, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (affectedArea) filter.affectedArea = affectedArea;

    const diseases = await Disease.find(filter);
    res.status(200).json(diseases);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single disease by ID
// @route   GET /api/diseases/:id
const getDiseaseById = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }
    res.status(200).json(disease);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a disease
// @route   PUT /api/diseases/:id
const updateDisease = async (req, res) => {
  try {
    const disease = await Disease.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document, not the old one
      runValidators: true, // re-check schema rules (e.g. enum, required) on update
    });
    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }
    res.status(200).json(disease);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a disease
// @route   DELETE /api/diseases/:id
const deleteDisease = async (req, res) => {
  try {
    const disease = await Disease.findByIdAndDelete(req.params.id);
    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }
    res.status(200).json({ message: "Disease deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createDisease,
  getDiseases,
  getDiseaseById,
  updateDisease,
  deleteDisease,
};
