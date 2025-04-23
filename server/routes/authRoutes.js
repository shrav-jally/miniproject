const express = require("express");
const router = express.Router();
const { register, login, verifyGoogleToken, getUserCount } = require("../controllers/authController");

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Google token verification route
router.post("/google/verify", verifyGoogleToken);

// Get user count route
router.get("/user-count", getUserCount);

module.exports = router;
