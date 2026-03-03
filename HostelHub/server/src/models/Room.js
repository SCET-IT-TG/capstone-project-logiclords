import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    room_id: { type: String, required: true, unique: true },
    room_number: String,
    block_name: String,
    capacity: Number,
    occupied_beds: { type: Number, default: 0 },
    room_status: { type: String, default: "available" },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);