import mongoose from "mongoose";

const feePaymentSchema = new mongoose.Schema(
{
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  payment_method: {
    type: String,
    enum: ["Cash", "UPI", "Card", "Bank"],
    default: "Cash"
  },

  receipt_no: {
    type: String,
    unique: true
  },

  remark: {
    type: String,
    default: ""
  }

},
{ timestamps: true }
);


// Auto generate receipt number
feePaymentSchema.pre("save", async function(next){

  if(!this.receipt_no){

    const count = await mongoose.model("FeePayment").countDocuments();

    const number = String(count + 1).padStart(4,"0");

    this.receipt_no = `RCPT-${number}`;

  }

  next();

});

export default mongoose.model("FeePayment", feePaymentSchema);