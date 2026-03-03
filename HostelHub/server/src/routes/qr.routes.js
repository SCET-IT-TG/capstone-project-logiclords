import express from "express";
import {
  createEntry,
  getEntries,
} from "../controllers/qr.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("warden"),
  createEntry
);

router.get(
  "/",
  protect,
  authorize("admin", "warden"),
  getEntries
);

export default router;