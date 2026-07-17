const Treatment = require("../models/Treatment");

// @desc    Create a new treatment
// @route   POST /api/treatments
const createTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.create(req.body);
    res.status(201).json(treatment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all treatments (optionally filter by disease or category)
// @route   GET /api/treatments
const getTreatments = async (req, res) => {
  try {
    const { disease, category } = req.query;
    let filter = {};
    if (disease) filter.disease = disease;
    if (category) filter.category = category;

    // .populate('disease') replaces the disease ID with the full disease document
    const treatments = await Treatment.find(filter).populate("disease");
    res.status(200).json(treatments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single treatment by ID
// @route   GET /api/treatments/:id
const getTreatmentById = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id).populate(
      "disease",
    );
    if (!treatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    res.status(200).json(treatment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a treatment
// @route   PUT /api/treatments/:id
const updateTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!treatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    res.status(200).json(treatment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a treatment
// @route   DELETE /api/treatments/:id
const deleteTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
    if (!treatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    res.status(200).json({ message: "Treatment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTreatment,
  getTreatments,
  getTreatmentById,
  updateTreatment,
  deleteTreatment,
};
