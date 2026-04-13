import express from "express";

import {
  getRooms,
  getRoomById,        // ✅ NEW
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus,
} from "../controllers/room.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

console.log("✅ room.routes loaded");

// ================= ROUTES =================

// GET ALL ROOMS
router.get("/", protect, getRooms);

// GET ROOM BY ID ✅ (IMPORTANT FOR EDIT)
router.get("/:id", protect, getRoomById);

// CREATE ROOM
router.post("/", protect, createRoom);

// UPDATE ROOM
router.put("/:id", protect, updateRoom);

// UPDATE STATUS
router.put("/status/:id", protect, updateRoomStatus);

// DELETE ROOM
router.delete("/:id", protect, deleteRoom);

export default router;