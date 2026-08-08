const DiagnosisHistory = require("../models/DiagnosisHistory");

// @desc    Save a diagnosis result to history
// @route   POST /api/history  (protected)
const createHistory = async (req, res) => {
  try {
    const {
      symptomsSelected,
      affectedArea,
      severity,
      suggestedDisease,
      matchScore,
    } = req.body;

    if (
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

    // The user comes from the verified token, never from the request body,
    // so one logged-in user can't write history entries under another user's id.
    const history = await DiagnosisHistory.create({
      user: req.user.id,
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
// @route   GET /api/history/user/:userId  (protected)
const getUserHistory = async (req, res) => {
  try {
    // Only allow a user to read their own history
    if (req.params.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this history" });
    }

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
