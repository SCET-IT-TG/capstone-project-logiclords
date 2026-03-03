import Student from "../models/Student.js";
import Room from "../models/Room.js";
import bcrypt from "bcryptjs";
import { generateId } from "../utils/generateId.js";
import { calculateFeeDetails } from "../utils/calculateFee.js";
import { generateQrImage } from "../utils/generateQr.js";

export const createStudentService = async (data) => {
  data.password = await bcrypt.hash(data.password, 10);
  data.student_id = await generateId(Student, "S");

  const qrPath = await generateQrImage(data.student_id, data.student_id);
  data.qr_code = qrPath;

  return await Student.create(data);
};

export const allocateRoomService = async (studentId, roomId) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Room not found");

  if (room.occupied_beds >= room.capacity)
    throw new Error("Room Full");

  room.occupied_beds += 1;
  await room.save();

  const student = await Student.findById(studentId);
  student.room_id = roomId;
  await student.save();

  return student;
};

export const updateStudentPhotoService = async (id, photoPath) => {
  const student = await Student.findById(id);
  student.profile_photo = photoPath;
  await student.save();
  return student;
};