const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { runDiagnosis } = require("../controllers/diagnosisController");

router.post("/match", protect, runDiagnosis);

module.exports = router;
