import Visitor from "../models/Visitor.js";
import Student from "../models/Student.js";


// ================= CREATE VISITOR =================

export const createVisitor = async (req, res) => {

  try {

    const {
      visitor_name,
      mobile_number,
      room_no,
      student,
      visit_date,
      purpose
    } = req.body;

    const role = req.user.role;

    // 🔹 Generate Visitor ID automatically
    const count = await Visitor.countDocuments();
    const visitor_id = "VIS" + String(count + 1).padStart(3, "0");

    const visitor = new Visitor({

      visitor_id,   // 🔥 auto generated id

      visitor_name,
      mobile_number,

      // room optional
      room_no: room_no || null,

      // if student not provided → assign logged in student
      student: student || req.user.id,

      visit_date,
      purpose,

      created_by: req.user.id,

      created_by_model:
        role === "student"
          ? "Student"
          : role === "warden"
          ? "Warden"
          : "Admin",

      // student requests require approval
      approved: role === "student" ? false : true,

      status: "PENDING"

    });

    await visitor.save();

    res.status(201).json({
      message: "Visitor request submitted",
      visitor
    });

  } catch (error) {

    console.log("VISITOR CREATE ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// ================= GET ALL VISITORS =================

export const getVisitors = async (req, res) => {

  try {

    const visitors = await Visitor.find()
      .populate("student", "first_name last_name student_id room_no")
      .sort({ createdAt: -1 });

    res.json(visitors);

  } catch (error) {

    console.log("GET VISITORS ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// ================= GET STUDENT VISITORS =================

export const getStudentVisitors = async (req, res) => {

  try {

    const studentId = req.user.id;

    const student = await Student.findById(studentId);

    const visitors = await Visitor.find({

      $or: [
        { room_no: student?.room_no },
        { student: studentId }
      ]

    }).sort({ createdAt: -1 });

    res.json(visitors);

  } catch (error) {

    console.log("STUDENT VISITOR ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// ================= APPROVE VISITOR =================

export const approveVisitor = async (req, res) => {

  try {

    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found"
      });
    }

    visitor.approved = true;

    await visitor.save();

    res.json({
      message: "Visitor approved",
      visitor
    });

  } catch (error) {

    console.log("APPROVE VISITOR ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// ================= CHECK IN =================

export const checkInVisitor = async (req, res) => {

  try {

    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found"
      });
    }

    visitor.status = "IN";
    visitor.check_in = new Date();

    await visitor.save();

    res.json({
      message: "Visitor checked in",
      visitor
    });

  } catch (error) {

    console.log("CHECKIN VISITOR ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// ================= CHECK OUT =================

export const checkOutVisitor = async (req, res) => {

  try {

    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found"
      });
    }

    visitor.status = "OUT";
    visitor.check_out = new Date();

    await visitor.save();

    res.json({
      message: "Visitor checked out",
      visitor
    });

  } catch (error) {

    console.log("CHECKOUT VISITOR ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};