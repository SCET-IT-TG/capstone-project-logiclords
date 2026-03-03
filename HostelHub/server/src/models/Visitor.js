import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    visitor_id: { type: String, required: true, unique: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    visitor_name: String,
    entry_time: Date,
    exit_time: Date,
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "Warden" },
  },
  { timestamps: true }
);

export default mongoose.model("Visitor", visitorSchema);