import express from "express";
import {
  createVisitor,
  getVisitors,
} from "../controllers/visitor.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("warden"),
  createVisitor
);

router.get(
  "/",
  protect,
  authorize("admin", "warden"),
  getVisitors
);

export default router;