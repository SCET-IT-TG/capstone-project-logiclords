import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import { generateId } from "../utils/generateId.js";

export const createAdminService = async (data) => {
  data.password = await bcrypt.hash(data.password, 10);
  data.admin_id = await generateId(Admin, "A");

  return await Admin.create(data);
};

export const getAdminsService = async () => {
  return await Admin.find();
};