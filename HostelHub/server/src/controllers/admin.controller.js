import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

// 🔐 GENERATE TOKEN
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(admin);

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        admin_id: admin.admin_id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        email: admin.email,
        role: admin.role,
        profile_photo: admin.profile_photo,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ADMIN PROFILE (FIX ADDED)
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};