const DiagnosisHistory = require("../models/DiagnosisHistory");

// @desc    Save a diagnosis result to history
// @route   POST /api/history
const createHistory = async (req, res) => {
  try {
    const {
      user,
      symptomsSelected,
      affectedArea,
      severity,
      suggestedDisease,
      matchScore,
    } = req.body;

    if (
      !user ||
      !symptomsSelected ||
      !affectedArea ||
      !severity ||
      !suggestedDisease ||
      matchScore === undefined
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required to save diagnosis history" });
    }

    const history = await DiagnosisHistory.create({
      user,
      symptomsSelected,
      affectedArea,
      severity,
      suggestedDisease,
      matchScore,
    });

    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get diagnosis history for a specific user
// @route   GET /api/history/user/:userId
const getUserHistory = async (req, res) => {
  try {
    const history = await DiagnosisHistory.find({ user: req.params.userId })
      .populate("symptomsSelected")
      .populate("suggestedDisease")
      .sort({ createdAt: -1 }); // most recent first

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createHistory, getUserHistory };
