const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the "Authorization: Bearer <token>" header, attaches the
// logged-in user to req.user, and rejects the request otherwise.
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Confirm the user still exists; strip the password hash from what we attach
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user no longer exists" });
    }

    req.user = user; // available to every downstream controller as req.user._id / req.user.id
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized, invalid or expired token" });
  }
};

// Chain AFTER `protect`. Rejects any logged-in user who isn't flagged isAdmin —
// this is what actually restricts admin-portal actions to one person, not
// just hiding the button on the frontend.
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { protect, requireAdmin };
