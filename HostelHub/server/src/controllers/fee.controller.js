import Student from "../models/Student.js";
import FeePayment from "../models/FeePayment.js";


// ================= GET ALL STUDENT FEES (ADMIN) =================
export const getAllFees = async (req,res)=>{

  try{

    if(req.user.role !== "admin"){
      return res.status(403).json({message:"Admin only"});
    }

    const students = await Student.find()
      .select("student_id first_name last_name mobile_number total_fee paid_amount");

    const result = students.map(s => ({
      ...s._doc,
      due_amount: s.total_fee - s.paid_amount
    }));

    res.json(result);

  }
  catch(error){
    res.status(500).json({message:error.message});
  }

};



// ================= PAY FEE =================
export const payFee = async (req,res)=>{

  try{

    if(req.user.role !== "admin"){
      return res.status(403).json({message:"Admin only"});
    }

    const { studentId, amount, payment_method } = req.body;

    const student = await Student.findById(studentId);

    if(!student){
      return res.status(404).json({message:"Student not found"});
    }

    student.paid_amount += amount;

    await student.save();

    const payment = new FeePayment({
      student: studentId,
      amount,
      payment_method
    });

    await payment.save();

    res.json({
      message:"Payment successful",
      payment
    });

  }
  catch(error){
    res.status(500).json({message:error.message});
  }

};



// ================= PAYMENT HISTORY =================
export const paymentHistory = async (req,res)=>{

  try{

    const history = await FeePayment.find()
      .populate("student","student_id first_name last_name");

    res.json(history);

  }
  catch(error){
    res.status(500).json({message:error.message});
  }

};



// ================= STUDENT VIEW OWN FEES =================
export const studentFeeStatus = async (req,res)=>{

  try{

    if(req.user.role !== "student"){
      return res.status(403).json({message:"Student only"});
    }

    const student = await Student.findById(req.user.id)
      .select("student_id first_name last_name total_fee paid_amount");

    const history = await FeePayment.find({student:req.user.id});

    res.json({
      student,
      due_amount: student.total_fee - student.paid_amount,
      history
    });

  }
  catch(error){
    res.status(500).json({message:error.message});
  }

};