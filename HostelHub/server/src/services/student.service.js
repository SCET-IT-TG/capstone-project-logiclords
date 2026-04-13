import Student from "../models/Student.js";
import Room from "../models/Room.js";
import bcrypt from "bcryptjs";
import { generateQrImage } from "../utils/generateQr.js";

/*
====================================================
CREATE STUDENT SERVICE
====================================================
*/

export const createStudentService = async (data) => {

  // 🔹 Generate Student ID (STU2026001)
  const year = new Date().getFullYear();

  const count = await Student.countDocuments();

  const student_id = `STU${year}${String(count + 1).padStart(3, "0")}`;

  data.student_id = student_id;


  // 🔹 Calculate Age
  if (data.date_of_birth) {
    const dob = new Date(data.date_of_birth);
    data.age = new Date().getFullYear() - dob.getFullYear();
  }


  // 🔹 Auto Password (firstname123)
  const generatedPassword = data.first_name.toLowerCase() + "123";

  data.password = await bcrypt.hash(generatedPassword, 10);


  // 🔹 Generate QR Code
  const qrPath = await generateQrImage(student_id, student_id);

  data.qr_code = qrPath;


  // 🔹 Create Student
  const student = await Student.create(data);


  return {
    student,
    generatedPassword
  };
};



/*
====================================================
ALLOCATE ROOM SERVICE
====================================================
*/

export const allocateRoomService = async (studentId, roomId) => {

  const room = await Room.findById(roomId);

  if (!room)
    throw new Error("Room not found");


  if (room.occupiedBeds >= room.capacity)
    throw new Error("Room full");


  const student = await Student.findById(studentId);

  if (!student)
    throw new Error("Student not found");


  // update room
  room.occupiedBeds += 1;

  if (room.occupiedBeds >= room.capacity)
    room.roomStatus = "full";

  await room.save();


  // update student
  student.room_id = roomId;
  student.room_no = room.roomNumber;

  await student.save();


  return student;

};



/*
====================================================
UPDATE STUDENT PHOTO SERVICE
====================================================
*/

export const updateStudentPhotoService = async (id, photoPath) => {

  const student = await Student.findById(id);

  if (!student)
    throw new Error("Student not found");


  student.profile_photo = photoPath;

  await student.save();

  return student;

};