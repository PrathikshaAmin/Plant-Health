const express = require("express");
const router = express.Router();
const {
  createSymptom,
  getSymptoms,
  getSymptomById,
  updateSymptom,
  deleteSymptom,
} = require("../controllers/symptomController");

router.post("/", createSymptom);
router.get("/", getSymptoms);
router.get("/:id", getSymptomById);
router.put("/:id", updateSymptom);
router.delete("/:id", deleteSymptom);

module.exports = router;
