import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
{
  // Who created complaint
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "created_by_model"
  },

  // Which model created complaint
  created_by_model: {
    type: String,
    required: true,
    enum: ["Student", "Warden", "Admin"]
  },

  // Complaint number (auto generated)
  complaint_no: {
    type: String,
    unique: true
  },

  // Complaint description
  complaint: {
    type: String,
    required: true
  },

  // 🔥 NEW: PHOTO FIELD (OPTIONAL)
  photo: {
    type: String,
    default: ""
  },

  // Status
  status: {
    type: String,
    enum: ["Pending", "Assigned", "Completed"],
    default: "Pending"
  },

  // Admin/Warden remark
  remark: {
    type: String,
    default: ""
  }

},
{ timestamps: true }
);


// 🔥 Auto generate complaint number
complaintSchema.pre("save", async function(next) {

  if (!this.complaint_no) {

    const count = await mongoose.model("Complaint").countDocuments();

    const number = String(count + 1).padStart(4, "0");

    this.complaint_no = `CMP-${number}`;
  }

  next();
});

export default mongoose.model("Complaint", complaintSchema);