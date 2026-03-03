import Warden from "../models/Warden.js";
import bcrypt from "bcryptjs";
import { generateId } from "../utils/generateId.js";

export const createWardenService = async (data) => {
  data.password = await bcrypt.hash(data.password, 10);
  data.warden_id = await generateId(Warden, "W");

  return await Warden.create(data);
};

export const getWardensService = async () => {
  return await Warden.find();
};

export const updateWardenPhotoService = async (id, photoPath) => {
  const warden = await Warden.findById(id);
  warden.profile_photo = photoPath;
  await warden.save();
  return warden;
};