import User from "../models/user.model.js";
import generateUserId from "../utils/generateUserId.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, year, joinYear } = req.body;

    // 🔥 Generate userId
    const userId = await generateUserId(role, { year, joinYear });

    console.log("Generated ID:", userId); // DEBUG

    const user = await User.create({
      userId,   // ✅ MUST include this
      name,
      email,
      password,
      role,
      year,
      joinYear
    });

    res.status(201).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};