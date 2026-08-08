const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const {
  createRule,
  getRules,
  getRuleById,
  updateRule,
  deleteRule,
} = require("../controllers/diagnosisRuleController");

router.get("/", getRules);
router.get("/:id", getRuleById);

router.post("/", protect, requireAdmin, createRule);
router.put("/:id", protect, requireAdmin, updateRule);
router.delete("/:id", protect, requireAdmin, deleteRule);

module.exports = router;
