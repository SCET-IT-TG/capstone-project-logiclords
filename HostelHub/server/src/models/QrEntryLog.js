import mongoose from "mongoose";

const qrSchema = new mongoose.Schema(
  {
    entry_id: { type: String, required: true, unique: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    scan_time: Date,
    entry_type: String,
    verified_by: { type: mongoose.Schema.Types.ObjectId, ref: "Warden" },
  },
  { timestamps: true }
);

export default mongoose.model("QrEntryLog", qrSchema);