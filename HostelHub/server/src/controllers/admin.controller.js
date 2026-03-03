import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

export const createAdmin = async (req, res) => {
  const data = req.body;
  data.password = await bcrypt.hash(data.password, 10);
  const admin = await Admin.create(data);
  res.json(admin);
};

export const getAdmins = async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
};

export const updateAdminPhoto = async (req, res) => {
  const admin = await Admin.findById(req.user.id);
  admin.profile_photo = req.file.path;
  await admin.save();
  res.json(admin);
};