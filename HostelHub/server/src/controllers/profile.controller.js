import Student from "../models/Student.js";
import Admin from "../models/Admin.js";
import Warden from "../models/Warden.js";

// ✅ UPDATE PROFILE PHOTO
export const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `uploads/${req.file.filename}`;

    let user;

    if (role === "student") {
      user = await Student.findByIdAndUpdate(
        userId,
        { profile_photo: filePath },
        { new: true }
      );
    } else if (role === "admin") {
      user = await Admin.findByIdAndUpdate(
        userId,
        { profile_photo: filePath },
        { new: true }
      );
    } else if (role === "warden") {
      user = await Warden.findByIdAndUpdate(
        userId,
        { profile_photo: filePath },
        { new: true }
      );
    }

    res.json({
      message: "Profile photo updated",
      profile_photo: filePath,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};