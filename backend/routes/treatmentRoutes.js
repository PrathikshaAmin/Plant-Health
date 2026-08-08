const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const {
  createTreatment,
  getTreatments,
  getTreatmentById,
  updateTreatment,
  deleteTreatment,
} = require("../controllers/treatmentController");

router.get("/", getTreatments);
router.get("/:id", getTreatmentById);

router.post("/", protect, requireAdmin, createTreatment);
router.put("/:id", protect, requireAdmin, updateTreatment);
router.delete("/:id", protect, requireAdmin, deleteTreatment);

module.exports = router;
