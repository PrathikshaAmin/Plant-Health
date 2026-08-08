const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createHistory,
  getUserHistory,
} = require("../controllers/historyController");

router.post("/", protect, createHistory);
router.get("/user/:userId", protect, getUserHistory);

module.exports = router;
