import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    // ✅ ENTRY CATEGORY (Student / Visitor)
    type: {
      type: String,
      enum: ["student", "visitor"],
      required: true,
    },

    // ✅ IN / OUT STATUS
    entry_type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },

    // ================= VISITOR FIELDS =================
    name: {
      type: String,
      trim: true,
    },

    mobile: {
      type: String,
      trim: true,
    },

    // ================= STUDENT FIELDS =================
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    // 🔥 STORE SNAPSHOT (IMPORTANT)
    student_name: String,
    student_mobile: String,

    // ================= ROOM =================
    room_no: String,
    block_no: String,

    // ================= TIME =================
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Entry", entrySchema);