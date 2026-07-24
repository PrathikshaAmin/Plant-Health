const DiagnosisRule = require("../models/DiagnosisRule");

// @desc    Run the diagnosis wizard — match user input against stored rules
// @route   POST /api/diagnosis/match
const runDiagnosis = async (req, res) => {
  try {
    const { affectedArea, symptoms, severity } = req.body;

    if (!affectedArea || !symptoms || !severity) {
      return res.status(400).json({
        message: "affectedArea, symptoms, and severity are all required",
      });
    }

    // Only consider rules matching the selected affected area
    const rules = await DiagnosisRule.find({ affectedArea })
      .populate("symptoms")
      .populate("disease");

    if (rules.length === 0) {
      return res.status(404).json({ message: "No matching diagnosis found" });
    }

    let bestMatch = null;
    let bestScore = 0;

    rules.forEach((rule) => {
      const ruleSymptomIds = rule.symptoms.map((s) => s._id.toString());

      // How many of the rule's required symptoms did the user actually select?
      const overlapCount = ruleSymptomIds.filter((id) =>
        symptoms.includes(id),
      ).length;
      const overlapRatio = overlapCount / ruleSymptomIds.length;

      // Skip rules with zero overlap — clearly not a match
      if (overlapRatio === 0) return;

      // Severity match gives full weight; mismatched severity reduces confidence
      const severityWeight = rule.severity === severity ? 1 : 0.7;

      const finalScore = Math.round(
        rule.matchScore * overlapRatio * severityWeight,
      );

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestMatch = rule;
      }
    });

    if (!bestMatch) {
      return res.status(404).json({ message: "No matching diagnosis found" });
    }

    res.status(200).json({
      disease: bestMatch.disease,
      matchScore: bestScore,
      severity,
      affectedArea,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { runDiagnosis };
