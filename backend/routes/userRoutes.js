const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUserProfile
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Logged-in User Profile
router.get("/profile", protect, getUserProfile);

module.exports = router;
