console.log("🚀 CREATE STUDENT FUNCTION CALLED");
import Student from "../models/Student.js";
import Room from "../models/Room.js";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import fs from "fs";

// ===============================
// ✅ CREATE STUDENT (FINAL DEBUG SAFE)
// ===============================
export const createStudent = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const data = req.body;

    // 🔥 STRICT VALIDATION
    const firstName = data.first_name;
    const lastName = data.last_name;
    const email = data.email;

    if (!firstName) {
      console.log("❌ FIRST NAME IS UNDEFINED");
      return res.status(400).json({
        message: "First name missing in request",
      });
    }

    if (!lastName || !email) {
      return res.status(400).json({
        message: "Last name and Email are required",
      });
    }

    // 🔥 AUTO ID GENERATION
    const count = await Student.countDocuments();
    const student_id = `STU2026${String(count + 1).padStart(3, "0")}`;
    const enrollment_no = `ENR2026${String(count + 1).padStart(3, "0")}`;

    // 🔥 CHECK DUPLICATE EMAIL
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 🔥 PASSWORD GENERATION
    const generated_password =
      firstName.trim().toLowerCase() + "123";

    console.log("Generated Password:", generated_password);

    const hashedPassword = await bcrypt.hash(generated_password, 10);

    // 🔥 QR GENERATION
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

    // 🔥 CREATE STUDENT
    const student = await Student.create({
      ...data,
      student_id,
      enrollment_no,
      password: hashedPassword,
      qr_code: qrPath,
      profile_photo: "uploads/default-avatar.png",
    });

    res.status(201).json({
      message: "Student Created Successfully",
      student_id,
      enrollment_no,
      generated_password,
      qr_code: qrPath,
    });

  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};