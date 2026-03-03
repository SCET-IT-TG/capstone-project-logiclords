import mongoose from "mongoose";

const wardenSchema = new mongoose.Schema(
  {
    warden_id: { type: String, required: true, unique: true },
    first_name: String,
    middle_name: String,
    last_name: String,
    date_of_birth: Date,
    assigned_block: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    qr_verification_access: { type: Boolean, default: true },
    profile_photo: {
      type: String,
      default: "uploads/default-avatar.png",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Warden", wardenSchema);