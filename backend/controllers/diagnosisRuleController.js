const DiagnosisRule = require("../models/DiagnosisRule");

// @desc    Create a new diagnosis rule
// @route   POST /api/diagnosis-rules
const createRule = async (req, res) => {
  try {
    const rule = await DiagnosisRule.create(req.body);
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all diagnosis rules (optionally filter by affectedArea/severity)
// @route   GET /api/diagnosis-rules
const getRules = async (req, res) => {
  try {
    const { affectedArea, severity } = req.query;
    let filter = {};
    if (affectedArea) filter.affectedArea = affectedArea;
    if (severity) filter.severity = severity;

    const rules = await DiagnosisRule.find(filter)
      .populate("symptoms")
      .populate("disease");
    res.status(200).json(rules);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single rule by ID
// @route   GET /api/diagnosis-rules/:id
const getRuleById = async (req, res) => {
  try {
    const rule = await DiagnosisRule.findById(req.params.id)
      .populate("symptoms")
      .populate("disease");
    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }
    res.status(200).json(rule);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a rule
// @route   PUT /api/diagnosis-rules/:id
const updateRule = async (req, res) => {
  try {
    const rule = await DiagnosisRule.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }
    res.status(200).json(rule);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a rule
// @route   DELETE /api/diagnosis-rules/:id
const deleteRule = async (req, res) => {
  try {
    const rule = await DiagnosisRule.findByIdAndDelete(req.params.id);
    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }
    res.status(200).json({ message: "Rule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createRule, getRules, getRuleById, updateRule, deleteRule };
