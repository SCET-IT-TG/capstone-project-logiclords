import express from "express";
import {
  createAdmin,
  getAdmins,
  updateAdminPhoto,
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();
router.post("/", createAdmin);
router.post("/", protect, authorize("admin"), createAdmin);
router.get("/", protect, authorize("admin"), getAdmins);

router.put(
  "/photo",
  protect,
  authorize("admin"),
  upload.single("photo"),
  updateAdminPhoto
);

export default router;