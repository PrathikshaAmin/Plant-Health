const express = require("express");
const router = express.Router();
const { runDiagnosis } = require("../controllers/diagnosisController");

router.post("/match", runDiagnosis);

module.exports = router;
