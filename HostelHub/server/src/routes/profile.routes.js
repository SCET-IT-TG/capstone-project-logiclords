import express from "express";
import { uploadProfilePhoto } from "../controllers/profile.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// ✅ UPLOAD PHOTO
router.post("/upload-photo", protect, upload.single("photo"), uploadProfilePhoto);

export default router;