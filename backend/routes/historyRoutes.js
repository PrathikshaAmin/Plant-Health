const express = require("express");
const router = express.Router();
const {
  createHistory,
  getUserHistory,
} = require("../controllers/historyController");

router.post("/", createHistory);
router.get("/user/:userId", getUserHistory);

module.exports = router;
