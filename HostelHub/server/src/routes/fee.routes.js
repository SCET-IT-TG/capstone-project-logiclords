import express from "express";

import {
  getAllFees,
  payFee,
  paymentHistory,
  studentFeeStatus
} from "../controllers/fee.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();


// Admin routes
router.get("/admin", protect, getAllFees);
router.post("/pay", protect, payFee);
router.get("/history", protect, paymentHistory);


// Student route
router.get("/student", protect, studentFeeStatus);

export default router;