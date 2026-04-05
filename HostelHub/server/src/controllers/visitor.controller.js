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

    const role = req.user?.role;

    // 🔥 SAFE USER ID
    const userId = req.user?._id || req.user?.id;

    // 🔥 UNIQUE VISITOR ID (NO DUPLICATE ISSUE)
    const visitor_id = `VIS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const visitor = new Visitor({

      visitor_id,

      visitor_name,
      mobile_number,

      room_no: room_no || null,

      // 🔥 STUDENT LINK
      student: student || userId,

      visit_date,
      purpose,

      created_by: userId,

      created_by_model:
        role === "student"
          ? "Student"
          : role === "warden"
          ? "Warden"
          : "Admin",

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
      message: error.message || "Server error"
    });

  }
};



// ================= GET ALL VISITORS =================
export const getVisitors = async (req, res) => {
  try {

    const role = req.user?.role;
    const userId = req.user?._id || req.user?.id;

    let visitors;

    if (role === "student") {
      // 🔥 STUDENT → ONLY OWN VISITORS
      visitors = await Visitor.find({
        student: userId
      })
        .populate("student", "first_name last_name student_id room_no")
        .sort({ createdAt: -1 });

    } else {
      // 🔥 ADMIN / WARDEN → ALL
      visitors = await Visitor.find()
        .populate("student", "first_name last_name student_id room_no")
        .sort({ createdAt: -1 });
    }

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

    const userId = req.user?._id || req.user?.id;

    const student = await Student.findById(userId);

    const visitors = await Visitor.find({
      $or: [
        { room_no: student?.room_no },
        { student: userId }
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

    const role = req.user?.role;

    if (!["admin", "warden"].includes(role)) {
      return res.status(403).json({
        message: "Only admin or warden can approve"
      });
    }

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