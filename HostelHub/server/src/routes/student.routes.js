import express from "express";

import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  allocateRoom,
  updateStudentPhoto,
  loginStudent,
} from "../controllers/student.controller.js"; // ✅ make sure file name correct

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

console.log("✅ student.routes loaded");

// ================= AUTH =================

// 🔐 LOGIN (Public)
router.post("/login", loginStudent);

// ================= CREATE =================

// ➕ CREATE STUDENT (Admin Only)
router.post("/", protect, authorize("admin"), createStudent);
// ================= UPDATE =================

// ✏️ UPDATE STUDENT
router.put("/:id", protect, authorize("admin"), updateStudent);

// 🏠 ALLOCATE ROOM
router.put("/allocate-room", protect, authorize("admin"), allocateRoom);

// 📸 UPDATE PHOTO (Student Only)
router.put(
  "/photo",
  protect,
  authorize("student"),
  upload.single("profile_photo"),
  updateStudentPhoto
);


// ================= READ =================

// 📄 GET ALL STUDENTS (Admin + Warden)
router.get("/", protect, authorize("admin", "warden"), getStudents);

// 📄 GET SINGLE STUDENT
router.get("/:id", protect, authorize("admin", "warden", "student"), getStudentById);


// ================= DELETE =================

// ❌ DELETE STUDENT (Admin Only)
router.delete("/:id", protect, authorize("admin"), deleteStudent);

export default router;