import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    admin_id: { type: String, required: true, unique: true },
    first_name: String,
    middle_name: String,
    last_name: String,
    date_of_birth: Date,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    last_login: Date,
    profile_photo: {
      type: String,
      default: "uploads/default-avatar.png",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);