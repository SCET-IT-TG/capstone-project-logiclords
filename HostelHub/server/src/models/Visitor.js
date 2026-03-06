import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
{
  // 🔹 Auto generated visitor id
  visitor_id:{
    type:String,
    unique:true
  },

  visitor_name: {
    type: String,
    required: true,
    trim: true
  },

  mobile_number: {
    type: String,
    required: true,
    trim: true
  },

  // Room is optional
  room_no: {
    type: String,
    default: null
  },

  // ✅ Student reference
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    default: null
  },

  visit_date: {
    type: Date,
    required: true
  },

  purpose: {
    type: String,
    trim: true
  },

  // Who created visitor request
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "created_by_model"
  },

  created_by_model: {
    type: String,
    enum: ["Student", "Admin", "Warden"]
  },

  // Warden/Admin approval
  approved: {
    type: Boolean,
    default: false
  },

  // Security Check-In time
  check_in: {
    type: Date,
    default: null
  },

  // Security Check-Out time
  check_out: {
    type: Date,
    default: null
  },

  status: {
    type: String,
    enum: ["PENDING", "IN", "OUT"],
    default: "PENDING"
  }

},
{
  timestamps: true
});

export default mongoose.model("Visitor", visitorSchema);