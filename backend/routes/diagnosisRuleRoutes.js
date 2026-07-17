const express = require("express");
const router = express.Router();
const {
  createRule,
  getRules,
  getRuleById,
  updateRule,
  deleteRule,
} = require("../controllers/diagnosisRuleController");

router.post("/", createRule);
router.get("/", getRules);
router.get("/:id", getRuleById);
router.put("/:id", updateRule);
router.delete("/:id", deleteRule);

module.exports = router;
