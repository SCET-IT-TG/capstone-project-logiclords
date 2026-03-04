import express from "express";

import {
  createStudent,
  getStudents,
  allocateRoom,
  updateStudentPhoto,
  loginStudent
} from "../controllers/student.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/*
====================================================
STUDENT ROUTES (REST STYLE)
====================================================
*/
// ✅ STUDENT LOGIN
router.post("/login", loginStudent);
// ✅ CREATE STUDENT — Admin Only + Upload Photo

router.post(
  "/",
  protect,
  authorize("admin"),
  createStudent
);

// ✅ GET ALL STUDENTS — Admin + Warden
router.get(
  "/",
  protect,
  authorize("admin", "warden"),
  getStudents
);

// ✅ ALLOCATE ROOM — Admin Only
router.put(
  "/allocate",
  protect,
  authorize("admin"),
  allocateRoom
);

// ✅ UPDATE STUDENT PHOTO — Student Only
router.put(
  "/photo",
  protect,
  authorize("student"),
  upload.single("profile_photo"), // 🔥 make consistent
  updateStudentPhoto
);

export default router;