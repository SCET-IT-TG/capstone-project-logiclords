import FeeTransaction from "../models/FeeTransaction.js";
import Student from "../models/Student.js";
import { generateId } from "../utils/generateId.js";
import { calculateFeeDetails } from "../utils/calculateFee.js";

export const createTransactionService = async (data) => {
  data.transaction_id = await generateId(FeeTransaction, "T");

  const transaction = await FeeTransaction.create(data);

  const student = await Student.findById(data.student_id);
  student.paid_amount += data.amount_paid;

  const feeData = calculateFeeDetails(
    student.total_fee,
    student.paid_amount
  );

  student.fee_status = feeData.fee_status;
  await student.save();

  return transaction;
};

export const getTransactionsService = async () => {
  return await FeeTransaction.find().populate("student_id");
};