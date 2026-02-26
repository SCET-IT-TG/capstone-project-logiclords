import User from "../models/user.model.js";

const generateUserId = async (role, data) => {

  if (role === "admin") {
    return "A2026";
  }

  if (role === "warden") {
    const count = await User.countDocuments({ role: "warden" });
    return `W${data.joinYear}${String(count + 1).padStart(2, "0")}`;
  }

  if (role === "student") {
    const count = await User.countDocuments({ role: "student" });
    return `S${data.year}${String(count + 1).padStart(2, "0")}`;
  }
};

export default generateUserId;