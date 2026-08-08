const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const {
  createDisease,
  getDiseases,
  getDiseaseById,
  updateDisease,
  deleteDisease,
} = require("../controllers/diseaseController");

// GET routes stay public so the mobile app's disease library works pre-login browsing
// GET /api/diseases  (supports ?search=&category=&affectedArea=)
router.get("/", getDiseases);

// GET /api/diseases/:id
router.get("/:id", getDiseaseById);

// Writes require the one admin account, not just any logged-in user
router.post("/", protect, requireAdmin, createDisease);
router.put("/:id", protect, requireAdmin, updateDisease);
router.delete("/:id", protect, requireAdmin, deleteDisease);

module.exports = router;
