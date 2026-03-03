import FeeTransaction from "../models/FeeTransaction.js";
import Student from "../models/Student.js";

export const createTransaction = async (req, res) => {
  const transaction = await FeeTransaction.create(req.body);

  const student = await Student.findById(req.body.student_id);
  student.paid_amount += req.body.amount_paid;

  if (student.paid_amount >= student.total_fee)
    student.fee_status = "paid";
  else student.fee_status = "partial";

  await student.save();

  res.json(transaction);
};

export const getTransactions = async (req, res) => {
  const transactions = await FeeTransaction.find().populate("student_id");
  res.json(transactions);
};