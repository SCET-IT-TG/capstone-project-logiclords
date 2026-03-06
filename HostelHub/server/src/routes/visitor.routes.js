import express from "express";

import {
  createVisitor,
  getVisitors,
  getStudentVisitors,
  approveVisitor,
  checkInVisitor,
  checkOutVisitor
} from "../controllers/visitor.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();


// ================= CREATE VISITOR =================
// Admin / Warden / Student
router.post("/", protect, createVisitor);


// ================= GET ALL VISITORS =================
// Admin / Warden only
router.get("/", protect, authorize("admin","warden"), getVisitors);


// ================= GET STUDENT VISITORS =================
// Student only
router.get("/student", protect, authorize("student"), getStudentVisitors);


// ================= APPROVE VISITOR =================
// Admin / Warden
router.put("/approve/:id", protect, authorize("admin","warden"), approveVisitor);


// ================= CHECK IN =================
// Admin / Warden
router.put("/checkin/:id", protect, authorize("admin","warden"), checkInVisitor);


// ================= CHECK OUT =================
// Admin / Warden
router.put("/checkout/:id", protect, authorize("admin","warden"), checkOutVisitor);


// ================= VISITORS WITHOUT ROOM =================
// Admin / Warden filter
router.get(
  "/no-room",
  protect,
  authorize("admin","warden"),
  async (req,res)=>{

    const Visitor = (await import("../models/Visitor.js")).default;

    const visitors = await Visitor.find({
      room_no:null
    });

    res.json(visitors);

  }
);

export default router;