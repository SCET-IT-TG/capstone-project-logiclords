import express from "express";

import {
  createComplaint,
  getComplaints,
  updateComplaintStatus
} from "../controllers/complaint.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.js"; // 🔥 ADD THIS

const router = express.Router();

// ✅ CREATE COMPLAINT (WITH OPTIONAL PHOTO)
router.post("/", protect, upload.single("photo"), createComplaint);

// ✅ GET ALL COMPLAINTS
router.get("/", protect, getComplaints);

// ✅ UPDATE STATUS (ASSIGN / COMPLETE)
router.put("/:id", protect, updateComplaintStatus);

export default router;