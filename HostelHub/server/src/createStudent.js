import Student from "../models/Student.js";
import Room from "../models/Room.js";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import fs from "fs";

// ===============================
// ✅ CREATE STUDENT (FINAL FIXED)
// ===============================
export const createStudent = async (req, res) => {
  try {
    console.log("🚀 CREATE STUDENT FUNCTION CALLED");
    console.log("BODY RECEIVED:", req.body);

    const data = req.body;

    // 🔥 VALIDATION
    const firstName = data.first_name;
    const lastName = data.last_name;
    const email = data.email;
    const roomInput = data.room_no;

    if (!firstName) {
      return res.status(400).json({
        message: "First name missing",
      });
    }

    if (!lastName || !email) {
      return res.status(400).json({
        message: "Last name and Email required",
      });
    }

    if (!roomInput) {
      return res.status(400).json({
        message: "Room number required",
      });
    }

    // 🔥 FIND ROOM (MATCH YOUR DB)
    const room = await Room.findOne({
      roomNumber: roomInput
    });

    console.log("Room Found:", room);

    if (!room) {
      return res.status(404).json({
        message: `Room not found: ${roomInput}`,
      });
    }

    // 🚫 CHECK FULL
    if (room.occupiedBeds >= room.capacity) {
      return res.status(400).json({
        message: "Room is already full",
      });
    }

    // 🚫 CHECK STATUS
    if (room.roomStatus.toLowerCase() === "full") {
      return res.status(400).json({
        message: "Room not available",
      });
    }

    // 🔥 AUTO ID
    const count = await Student.countDocuments();
    const student_id = `STU2026${String(count + 1).padStart(3, "0")}`;
    const enrollment_no = `ENR2026${String(count + 1).padStart(3, "0")}`;

    // 🔥 DUPLICATE EMAIL
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 🔥 PASSWORD
    const generated_password =
      firstName.trim().toLowerCase() + "123";

    const hashedPassword = await bcrypt.hash(generated_password, 10);

    // 🔥 QR
    const qrData = JSON.stringify({
      student_id,
      name: `${firstName} ${lastName}`,
      email,
    });

    const qrFolder = "uploads/qr";
    if (!fs.existsSync(qrFolder)) {
      fs.mkdirSync(qrFolder, { recursive: true });
    }

    const qrPath = `${qrFolder}/${student_id}.png`;
    await QRCode.toFile(qrPath, qrData);

    // ✅ CREATE STUDENT WITH ROOM
    const student = await Student.create({
      ...data,
      student_id,
      enrollment_no,
      password: hashedPassword,
      qr_code: qrPath,
      profile_photo: "uploads/default-avatar.png",
      room_id: room._id,
      room_no: room.roomNumber
    });

    // 🔄 UPDATE ROOM
    room.occupiedBeds += 1;
    room.roomStatus =
      room.occupiedBeds >= room.capacity ? "full" : "available";

    await room.save();

    res.status(201).json({
      message: "Student Created Successfully",
      student_id,
      enrollment_no,
      generated_password,
      room_number: room.roomNumber,
      qr_code: qrPath,
    });

  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};