import express from "express";

import {
  getAllFees,
  payFee,
  paymentHistory,
  studentFeeStatus,
  updateTotalFee
} from "../controllers/fee.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();


// ================= ADMIN ROUTES =================

// ✅ get all students fee
router.get("/admin", protect, getAllFees);

// ✅ update total fee
router.put("/update/:id", protect, updateTotalFee);

// ✅ pay fee (student id in params)
router.post("/pay/:id", protect, payFee);

// ✅ payment history (student-wise)
router.get("/history/:id", protect, paymentHistory);


// ================= STUDENT ROUTE =================

// ✅ student own fee
router.get("/student", protect, studentFeeStatus);


export default router;