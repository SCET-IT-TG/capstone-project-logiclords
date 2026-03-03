import express from "express";
import {
  createTransaction,
  getTransactions,
} from "../controllers/fee.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin"),
  createTransaction
);

router.get(
  "/",
  protect,
  authorize("admin"),
  getTransactions
);

export default router;