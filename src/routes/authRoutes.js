const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
} = require("../validators/authValidator");

// Register
router.post("/register", validateRegister, authController.register);

// Login
router.post("/login", validateLogin, authController.login);

// Get all users (protected route)
router.get("/users", protect, authController.getUsers);

module.exports = router;
