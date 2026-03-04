import Student from "../models/Student.js";
import Room from "../models/Room.js";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";

// ✅ CREATE STUDENT (Auto ID + Auto Room + Auto Password)
export const createStudent = async (req, res) => {
  try {

    const data = req.body;

    // 🔥 Auto Generate Student ID
    const count = await Student.countDocuments();
    const student_id = `STU2026${String(count + 1).padStart(3, "0")}`;

    // ❗ Check duplicate email
    const existingEmail = await Student.findOne({ email: data.email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ❗ Check duplicate enrollment
    const existingEnrollment = await Student.findOne({
      enrollment_no: data.enrollment_no
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "Enrollment number already exists"
      });
    }

    // 🔎 Find available room
    const room = await Room.findOne({
      roomStatus: "available",
      $expr: { $lt: ["$occupiedBeds", "$capacity"] }
    });

    if (!room) {
      return res.status(400).json({
        message: "No rooms available"
      });
    }

    // 🔐 Generate default password
    const generatedPassword = data.first_name.toLowerCase() + "123";
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // 👨‍🎓 Create student
    const student = await Student.create({
      ...data,
      student_id,
      password: hashedPassword,
      room_id: room._id
    });

    // 🛏 Update room occupancy
    room.occupiedBeds += 1;

    if (room.occupiedBeds >= room.capacity) {
      room.roomStatus = "full";
    }

    await room.save();

    res.status(201).json({
      message: "Student created and room allocated",
      student_id,
      enrollment_no: data.enrollment_no,
      room_number: room.roomNumber,
      block_name: room.blockName,
      generated_password: generatedPassword
    });

  } catch (error) {

    console.error("Create Student Error:", error);

    res.status(500).json({ message: error.message });
  }
};



// ✅ GET ALL STUDENTS
export const getStudents = async (req, res) => {
  try {

    const students = await Student.find().populate("room_id");

    res.json(students);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};



// ✅ MANUAL ROOM ALLOCATION
export const allocateRoom = async (req, res) => {
  try {

    const { studentId, roomId } = req.body;

    const room = await Room.findById(roomId);

    if (!room)
      return res.status(404).json({ message: "Room not found" });

    if (room.occupiedBeds >= room.capacity)
      return res.status(400).json({ message: "Room Full" });

    const student = await Student.findById(studentId);

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    room.occupiedBeds += 1;

    if (room.occupiedBeds >= room.capacity) {
      room.roomStatus = "full";
    }

    await room.save();

    student.room_id = roomId;

    await student.save();

    res.json({ message: "Room Allocated Successfully" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};



// ✅ UPDATE STUDENT PHOTO
export const updateStudentPhoto = async (req, res) => {
  try {

    const student = await Student.findById(req.user.id);

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    student.profile_photo = req.file.path;

    await student.save();

    res.json(student);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};
// ✅ STUDENT LOGIN
export const loginStudent = async (req, res) => {
  try {

    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
        role: "student"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: student
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};