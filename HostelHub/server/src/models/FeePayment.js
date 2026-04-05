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
    required: true,
    min: 1
  },

  // 🔥 FIX: rename to match controller (payment_mode)
  payment_mode: {
    type: String,
    enum: ["Cash", "UPI", "Paytm", "Card", "Bank"],
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


// ================= AUTO GENERATE RECEIPT =================
feePaymentSchema.pre("save", async function(next){

  try {

    if (!this.receipt_no) {

      // 🔥 better unique logic (timestamp + random)
      const unique = Date.now() + Math.floor(Math.random() * 1000);

      this.receipt_no = `RCPT-${unique}`;
    }

    next();

  } catch (err) {
    next(err);
  }

});


// ================= INDEX (FAST QUERY) =================
feePaymentSchema.index({ student: 1, createdAt: -1 });


export default mongoose.model("FeePayment", feePaymentSchema);