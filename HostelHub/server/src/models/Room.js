import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    room_no: { type: String, required: true },
    block_no: { type: String, required: true },

    capacity: { type: Number, required: true },
    occupied_beds: { type: Number, default: 0 },

    room_type: {
      type: String,
      enum: ["AC", "Non-AC"],
      required: true,
    },

    rent_per_month: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Available", "Full"],
      default: "Available",
    },
  },
  { timestamps: true }
);


// 🔥 AUTO UPDATE STATUS BEFORE SAVE
roomSchema.pre("save", function (next) {
  if (this.occupied_beds >= this.capacity) {
    this.status = "Full";
  } else {
    this.status = "Available";
  }
  next();
});

export default mongoose.model("Room", roomSchema);