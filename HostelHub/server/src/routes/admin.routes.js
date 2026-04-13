import express from "express";
import { loginAdmin, getAdminById } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ LOGIN
router.post("/login", loginAdmin);

// ✅ GET ADMIN PROFILE (FIX ADDED)
router.get("/:id", protect, getAdminById);

export default router;