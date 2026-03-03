import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    complaint_id: { type: String, required: true, unique: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    warden_id: { type: mongoose.Schema.Types.ObjectId, ref: "Warden" },
    complaint_type: String,
    complaint_status: { type: String, default: "pending" },
    resolution_date: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);