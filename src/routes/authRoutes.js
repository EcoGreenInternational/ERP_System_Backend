import express from "express";
const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";
import * as authController from "../controller/authController.js";
import { validateRegister, validateLogin } from "../validators/authValidator.js";

// Register
router.post("/register", validateRegister, authController.register);

// Login
router.post("/login", validateLogin, authController.login);

// Get all users (protected route)
router.get("/users", protect, authController.getUsers);

export default router;