import PDFDocument from "pdfkit";
import FeePayment from "../models/FeePayment.js";

export const generateReceipt = async (req, res) => {

  try {

    const payment = await FeePayment.findById(req.params.id)
      .populate("student", "student_id first_name last_name");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${payment.receipt_no}.pdf`
    );

    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Hostel Fee Receipt", { align: "center" });

    doc.moveDown();

    doc.fontSize(12).text(`Receipt No: ${payment.receipt_no}`);
    doc.text(`Student ID: ${payment.student.student_id}`);
    doc.text(`Name: ${payment.student.first_name} ${payment.student.last_name}`);
    doc.text(`Amount Paid: ₹${payment.amount}`);
    doc.text(`Payment Method: ${payment.payment_method}`);
    doc.text(`Date: ${payment.createdAt}`);

    doc.end();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};