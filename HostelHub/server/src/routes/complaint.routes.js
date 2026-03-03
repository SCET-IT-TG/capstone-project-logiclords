import express from "express";
import {
  createComplaint,
  getComplaints,
  resolveComplaint,
} from "../controllers/complaint.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("student"), createComplaint);

router.get(
  "/",
  protect,
  authorize("admin", "warden"),
  getComplaints
);

router.put(
  "/resolve/:id",
  protect,
  authorize("warden"),
  resolveComplaint
);

export default router;