const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const {
  createSymptom,
  getSymptoms,
  getSymptomById,
  updateSymptom,
  deleteSymptom,
} = require("../controllers/symptomController");

router.get("/", getSymptoms);
router.get("/:id", getSymptomById);

router.post("/", protect, requireAdmin, createSymptom);
router.put("/:id", protect, requireAdmin, updateSymptom);
router.delete("/:id", protect, requireAdmin, deleteSymptom);

module.exports = router;
