const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  adminLogin,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/admin-login  (admin portal only — requires isAdmin: true)
router.post("/admin-login", adminLogin);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
