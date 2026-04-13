import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    transaction_id: { type: String, required: true, unique: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    amount_paid: Number,
    payment_date: Date,
    payment_mode: String,
    receipt_number: String,
  },
  { timestamps: true }
);

export default mongoose.model("FeeTransaction", feeSchema);