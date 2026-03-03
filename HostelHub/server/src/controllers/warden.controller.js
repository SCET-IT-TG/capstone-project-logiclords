import Warden from "../models/Warden.js";
import bcrypt from "bcryptjs";

export const createWarden = async (req, res) => {
  const data = req.body;
  data.password = await bcrypt.hash(data.password, 10);
  const warden = await Warden.create(data);
  res.json(warden);
};

export const getWardens = async (req, res) => {
  const wardens = await Warden.find();
  res.json(wardens);
};

export const updateWardenPhoto = async (req, res) => {
  const warden = await Warden.findById(req.user.id);
  warden.profile_photo = req.file.path;
  await warden.save();
  res.json(warden);
};