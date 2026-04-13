// utils/calculateFee.js

export const calculateFeeDetails = (totalFee, paidAmount) => {
  let status = "pending";
  let due = totalFee - paidAmount;

  if (paidAmount >= totalFee) {
    status = "paid";
    due = 0;
  } else if (paidAmount > 0) {
    status = "partial";
  }

  return {
    fee_status: status,
    due_amount: due,
  };
};