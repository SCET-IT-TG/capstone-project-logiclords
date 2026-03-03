import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, unique: true },
    enrollment_no: { type: String, required: true, unique: true },

    first_name: String,
    middle_name: String,
    last_name: String,

    date_of_birth: Date,
    gender: String,
    mobile_number: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },

    admission_date: Date,

    fee_status: { type: String, default: "pending" },
    total_fee: { type: Number, default: 0 },
    paid_amount: { type: Number, default: 0 },

    qr_code: String,

    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },

    profile_photo: {
      type: String,
      default: "uploads/default-avatar.png",
    },
  },
  { timestamps: true }
);

studentSchema.virtual("due_amount").get(function () {
  return this.total_fee - this.paid_amount;
});

export default mongoose.model("Student", studentSchema);