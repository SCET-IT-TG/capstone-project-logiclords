import Student from "../models/Student.js";
import Room from "../models/Room.js";
import bcrypt from "bcryptjs";

export const createStudent = async (req, res) => {
  const data = req.body;
  data.password = await bcrypt.hash(data.password, 10);

  const student = await Student.create(data);
  res.json(student);
};

export const getStudents = async (req, res) => {
  const students = await Student.find().populate("room_id");
  res.json(students);
};

export const allocateRoom = async (req, res) => {
  const { studentId, roomId } = req.body;

  const room = await Room.findById(roomId);
  if (room.occupied_beds >= room.capacity)
    return res.status(400).json({ message: "Room Full" });

  room.occupied_beds += 1;
  await room.save();

  const student = await Student.findById(studentId);
  student.room_id = roomId;
  await student.save();

  res.json({ message: "Room Allocated" });
};

export const updateStudentPhoto = async (req, res) => {
  const student = await Student.findById(req.user.id);
  student.profile_photo = req.file.path;
  await student.save();
  res.json(student);
};