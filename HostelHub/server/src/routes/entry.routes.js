import express from "express";
import {
  createEntry,
  getTodayEntries,
  getAllEntries,
} from "../controllers/entry.controller.js"; // ⚠️ make sure file name correct

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

console.log("✅ entry.routes loaded");

// ================= CREATE ENTRY (QR SCAN) =================
router.post("/", protect, createEntry);

// ================= TODAY ENTRIES =================
router.get("/today", protect, getTodayEntries);

// ================= ENTRY HISTORY =================
router.get("/history", protect, getAllEntries);

export default router;