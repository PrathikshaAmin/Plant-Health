const express = require("express");
const router = express.Router();
const {
  createDisease,
  getDiseases,
  getDiseaseById,
  updateDisease,
  deleteDisease,
} = require("../controllers/diseaseController");

// POST /api/diseases
router.post("/", createDisease);

// GET /api/diseases  (supports ?search=&category=&affectedArea=)
router.get("/", getDiseases);

// GET /api/diseases/:id
router.get("/:id", getDiseaseById);

// PUT /api/diseases/:id
router.put("/:id", updateDisease);

// DELETE /api/diseases/:id
router.delete("/:id", deleteDisease);

module.exports = router;
