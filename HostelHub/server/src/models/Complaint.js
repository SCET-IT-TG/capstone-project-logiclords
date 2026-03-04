import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
{
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "created_by_model"
  },

  created_by_model: {
    type: String,
    required: true,
    enum: ["Student", "Warden"]
  },

  complaint: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Assigned", "Completed"],
    default: "Pending"
  }

},
{ timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);