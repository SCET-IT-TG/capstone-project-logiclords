import Student from "../models/Student.js";
import FeePayment from "../models/FeePayment.js";


// ================= COMMON: UPDATE FEE STATUS =================
const updateFeeStatus = (student) => {
  if (student.paid_amount === 0) {
    student.fee_status = "pending";
  } else if (student.paid_amount < student.total_fee) {
    student.fee_status = "partial";
  } else {
    student.fee_status = "paid";
  }
};


// ================= GET ALL STUDENT FEES (ADMIN) =================
export const getAllFees = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const students = await Student.find()
      .select("student_id first_name last_name mobile_number total_fee paid_amount fee_status");

    const result = students.map((s) => ({
      ...s._doc,
      due_amount: (s.total_fee || 0) - (s.paid_amount || 0),
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= UPDATE TOTAL FEE =================
export const updateTotalFee = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { total_fee } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.total_fee = Number(total_fee);

    updateFeeStatus(student); // 🔥 IMPORTANT

    await student.save();

    res.json({
      message: "Total fee updated",
      student,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= PAY FEE =================
export const payFee = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { amount, payment_mode } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ update paid amount
    student.paid_amount += Number(amount);

    updateFeeStatus(student); // 🔥 IMPORTANT

    await student.save();

    // ✅ generate receipt
    const receipt_no = "RCPT" + Date.now();

    const payment = new FeePayment({
      student: student._id,
      amount,
      payment_mode,
      receipt_no,
    });

    await payment.save();

    res.json({
      message: "Payment successful",
      payment,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= PAYMENT HISTORY (STUDENT-WISE) =================
export const paymentHistory = async (req, res) => {
  try {

    const history = await FeePayment.find({
      student: req.params.id,
    }).sort({ date: -1 });

    res.json(history);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= STUDENT VIEW OWN FEES =================
export const studentFeeStatus = async (req, res) => {
  try {

    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Student only" });
    }

    const student = await Student.findById(req.user.id)
      .select("student_id first_name last_name total_fee paid_amount fee_status");

    const history = await FeePayment.find({
      student: req.user.id,
    }).sort({ date: -1 });

    res.json({
      student,
      due_amount: (student.total_fee || 0) - (student.paid_amount || 0),
      history,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};