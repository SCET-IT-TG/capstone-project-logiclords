import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import Warden from "../models/Warden.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user =
    (await Admin.findOne({ email })) ||
    (await Student.findOne({ email })) ||
    (await Warden.findOne({ email }));

  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: user.role || "student" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, { httpOnly: true });

  // Remove password from response safely
  const { password: hashedPassword, ...userData } = user._doc;

  res.json(userData);
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};