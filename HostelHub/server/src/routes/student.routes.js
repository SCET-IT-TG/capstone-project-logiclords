import express from "express";
import {
  createStudent,
  getStudents,
  allocateRoom,
  updateStudentPhoto,
} from "../controllers/student.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createStudent);
router.get("/", protect, authorize("admin", "warden"), getStudents);

router.put(
  "/allocate",
  protect,
  authorize("admin"),
  allocateRoom
);

router.put(
  "/photo",
  protect,
  authorize("student"),
  upload.single("photo"),
  updateStudentPhoto
);

export default router;