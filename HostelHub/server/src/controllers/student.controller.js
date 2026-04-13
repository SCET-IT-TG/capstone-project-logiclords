import Student from "../models/Student.js";
import Room from "../models/Room.js";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import fs from "fs";

// ================= CREATE STUDENT =================
export const createStudent = async (req, res) => {
  try {
    const data = req.body;

    const firstName = data.first_name;
    const lastName = data.last_name;
    const email = data.email;
    const roomInput = data.room_no;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    if (!roomInput) {
      return res.status(400).json({
        message: "Room number required",
      });
    }

    // ✅ FIXED ROOM FIND
    const room = await Room.findOne({ room_no: roomInput });

    if (!room) {
      return res.status(404).json({
        message: `Room not found: ${roomInput}`,
      });
    }

    // ✅ FIXED FIELD NAMES
    if (room.occupied_beds >= room.capacity) {
      return res.status(400).json({
        message: "Room is full",
      });
    }

    if (room.status === "Full") {
      return res.status(400).json({
        message: "Room not available",
      });
    }

    const count = await Student.countDocuments();
    const student_id = `STU2026${String(count + 1).padStart(3, "0")}`;
    const enrollment_no = `ENR2026${String(count + 1).padStart(3, "0")}`;

    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const generated_password = firstName.toLowerCase() + "123";
    const hashedPassword = await bcrypt.hash(generated_password, 10);

    // QR CODE
    const qrFolder = "uploads/qr";
    if (!fs.existsSync(qrFolder)) {
      fs.mkdirSync(qrFolder, { recursive: true });
    }

    const qrPath = `${qrFolder}/${student_id}.png`;
    await QRCode.toFile(qrPath, student_id);

    // ✅ CREATE STUDENT
    const student = await Student.create({
      ...data,
      student_id,
      enrollment_no,
      password: hashedPassword,
      qr_code: qrPath,
      profile_photo: "uploads/default-avatar.png",
      room_id: room._id,
      room_no: room.room_no,
    });

    // ✅ UPDATE ROOM
    room.occupied_beds += 1;

    room.status =
      room.occupied_beds >= room.capacity ? "Full" : "Available";

    await room.save();

    res.status(201).json({
      message: "Student Created Successfully",
      student_id,
      enrollment_no,
      generated_password,
      room_number: room.room_no,
    });

  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET STUDENTS =================
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate({
        path: "room_id",
        model: "Room", // 🔥 FORCE correct model
        select: "block_no room_no room_type", // 🔥 IMPORTANT
      });

    res.json(students);
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
//get student by id
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("room_id", "block_no room_no room_type"); 

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= ALLOCATE ROOM =================
export const allocateRoom = async (req, res) => {
  try {
    const { studentId, roomId } = req.body;

    const student = await Student.findById(studentId);
    const room = await Room.findById(roomId);

    if (!student || !room) {
      return res.status(404).json({
        message: "Student or Room not found",
      });
    }

    if (student.room_id) {
      return res.status(400).json({
        message: "Student already has a room",
      });
    }

    // ✅ FIXED FIELD
    if (room.occupied_beds >= room.capacity) {
      return res.status(400).json({
        message: "Room is full",
      });
    }

    student.room_id = roomId;
    student.room_no = room.room_no;
    await student.save();

    // ✅ UPDATE ROOM
    room.occupied_beds += 1;

    room.status =
      room.occupied_beds >= room.capacity ? "Full" : "Available";

    await room.save();

    res.json({
      message: "Room allocated successfully",
      student,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//update student 
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // OPTIONAL: handle room change
    if (req.body.room_id && req.body.room_id !== String(student.room_id)) {
      // decrease old room
      if (student.room_id) {
        const oldRoom = await Room.findById(student.room_id);
        if (oldRoom) {
          oldRoom.occupied_beds -= 1;
          await oldRoom.save();
        }
      }

      // increase new room
      const newRoom = await Room.findById(req.body.room_id);
      if (newRoom) {
        newRoom.occupied_beds += 1;
        await newRoom.save();
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Student updated successfully",
      student: updatedStudent,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ FIXED ROOM UPDATE
    if (student.room_id) {
      const room = await Room.findById(student.room_id);

      if (room) {
        room.occupied_beds = Math.max(0, room.occupied_beds - 1);

        // ✅ UPDATE STATUS ALSO
        room.status =
          room.occupied_beds >= room.capacity ? "Full" : "Available";

        await room.save();
      }
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Student deleted successfully",
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);

    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};
// ================= UPDATE PHOTO =================
export const updateStudentPhoto = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    student.profile_photo = req.file.path;
    await student.save();

    res.json({
      message: "Photo updated successfully",
      student,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE ROOM
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ROOM
export const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);

    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= LOGIN =================
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: student._id,
        first_name: student.first_name,
        email: student.email,
        role: "student",
        qr_code: student.qr_code,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};