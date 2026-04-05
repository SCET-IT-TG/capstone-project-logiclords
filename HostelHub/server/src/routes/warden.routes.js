import express from "express";
import {
  createWarden,
  getWardens,
  getWardenById,
  updateWarden,
  deleteWarden,
  updateWardenPhoto,
} from "../controllers/warden.controller.js";

const router = express.Router();

// ================= CREATE =================
router.post("/create", createWarden);

// ================= GET =================
router.get("/", getWardens);
router.get("/:id", getWardenById);

// ================= UPDATE =================
router.put("/:id", updateWarden);

// ================= DELETE =================
router.delete("/:id", deleteWarden);

// ================= PHOTO UPDATE =================
router.put("/photo", updateWardenPhoto);

export default router;