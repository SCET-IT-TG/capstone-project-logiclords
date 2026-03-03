import express from "express";
import {
  createWarden,
  getWardens,
  updateWardenPhoto,
} from "../controllers/warden.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createWarden);
router.get("/", protect, authorize("admin"), getWardens);

router.put(
  "/photo",
  protect,
  authorize("warden"),
  upload.single("photo"),
  updateWardenPhoto
);

export default router;