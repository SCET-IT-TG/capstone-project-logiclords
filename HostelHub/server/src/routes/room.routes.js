import express from "express";
import {
  createRoom,
  getRooms,
  updateRoomStatus,
} from "../controllers/room.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createRoom);
router.get("/", protect, authorize("admin", "warden"), getRooms);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateRoomStatus
);

export default router;