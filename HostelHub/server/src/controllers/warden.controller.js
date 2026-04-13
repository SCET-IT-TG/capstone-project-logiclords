import Warden from "../models/Warden.js";
import bcrypt from "bcryptjs";

// ==============================
// CREATE WARDEN
// ==============================
export const createWarden = async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      assigned_block,
      email,
    } = req.body;

    // Generate Warden ID
    const lastWarden = await Warden.findOne().sort({ createdAt: -1 });

    let newId = "WD001";

    if (lastWarden) {
      const lastNumber = parseInt(lastWarden.warden_id.slice(2));
      newId = "WD" + String(lastNumber + 1).padStart(3, "0");
    }

    // Generate default password
    const generatedPassword = first_name.toLowerCase() + "123";
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const warden = await Warden.create({
      warden_id: newId,
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      assigned_block,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Warden created successfully",
      warden,
      generated_password: generatedPassword,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating warden",
      error: error.message,
    });
  }
};

// ==============================
// GET ALL WARDENS
// ==============================
export const getWardens = async (req, res) => {
  try {
    const wardens = await Warden.find();
    res.json(wardens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// GET SINGLE WARDEN
// ==============================
export const getWardenById = async (req, res) => {
  try {
    const warden = await Warden.findById(req.params.id);

    if (!warden) {
      return res.status(404).json({ message: "Warden not found" });
    }

    res.json(warden);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// UPDATE WARDEN
// ==============================
export const updateWarden = async (req, res) => {
  try {
    const warden = await Warden.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!warden) {
      return res.status(404).json({ message: "Warden not found" });
    }

    res.json({
      message: "Warden updated successfully",
      warden,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// DELETE WARDEN
// ==============================
export const deleteWarden = async (req, res) => {
  try {
    const warden = await Warden.findByIdAndDelete(req.params.id);

    if (!warden) {
      return res.status(404).json({ message: "Warden not found" });
    }

    res.json({
      message: "Warden deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==============================
// UPDATE WARDEN PHOTO
// ==============================
export const updateWardenPhoto = async (req, res) => {
  try {
    const warden = await Warden.findById(req.user.id);

    if (!warden) {
      return res.status(404).json({ message: "Warden not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    warden.profile_photo = req.file.path;
    await warden.save();

    res.json({
      message: "Photo updated successfully",
      warden,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};