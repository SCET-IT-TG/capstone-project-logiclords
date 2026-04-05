import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import Warden from "../models/Warden.js";

const generateToken = (user, role) => {
  return jwt.sign(
    {
      id: user._id,
      role: role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    let user = null;
    let role = "";

    // 🔍 Check Admin
    const admin = await Admin.findOne({ email });
    if (admin) {
      user = admin;
      role = "admin";
    }

    // 🔍 Check Student
    if (!user) {
      const student = await Student.findOne({ email });
      if (student) {
        user = student;
        role = "student";
      }
    }

    // 🔍 Check Warden
    if (!user) {
      const warden = await Warden.findOne({ email });
      if (warden) {
        user = warden;
        role = "warden";
      }
    }

    // ❌ User not found
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔐 Password check
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user, role);

    // 🔥 Resolve name safely
    const firstName =
      user.first_name ||
      user.admin_name?.split(" ")[0] ||
      user.name?.split(" ")[0] ||
      "";

    const lastName =
      user.last_name ||
      user.admin_name?.split(" ").slice(1).join(" ") ||
      user.name?.split(" ").slice(1).join(" ") ||
      "";

    // ✅ FIX: include qr_code (only for students)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        first_name: firstName,
        last_name: lastName,
        email: user.email,
        role: role,
        qr_code: role === "student" ? user.qr_code : null, // 🔥 IMPORTANT FIX
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};