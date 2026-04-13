import User from "../models/user.model.js";
import Student from "../models/student.model.js";
import generateUserId from "../utils/generateUserId.js";
import { allocateRoom } from "./allocation.service.js";
import { generateQR } from "../utils/qrGenerator.js";

export const createUserService = async (data) => {

  const { name, email, role } = data;

  const userId = await generateUserId(role);

  const password = name + "123";

  const user = await User.create({
    userId,
    name,
    email,
    password,
    role
  });

  // 🔥 AUTO ROOM ALLOCATION
  if (role === "student") {

    const room = await allocateRoom();

    const qrCode = await generateQR(userId);

    await Student.create({
      user: user._id,
      room: room._id,
      qrCode
    });
  }

  return user;
};
