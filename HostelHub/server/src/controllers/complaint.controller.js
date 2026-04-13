import Complaint from "../models/Complaint.js";


// ================= CREATE COMPLAINT =================
export const createComplaint = async (req, res) => {
  try {
     console.log("USER DATA:", req.user);
    const { complaint } = req.body;

    if (!complaint) {
      return res.status(400).json({ message: "Complaint text required" });
    }

    const role = req.user?.role;

    if (!["student", "warden"].includes(role)) {
      return res.status(403).json({
        message: "Only student or warden can create complaints"
      });
    }

    const model = role === "warden" ? "Warden" : "Student";

    // ✅ OPTIONAL PHOTO
    const photo = req.file ? req.file.path : "";

    // 🔥 UNIQUE COMPLAINT NUMBER (NO DUPLICATE ISSUE)
    const complaint_no = `CMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newComplaint = await Complaint.create({
      created_by: req.user?._id || req.user?.id,
      created_by_model: model,
      complaint,
      photo,
      complaint_no,   // 🔥 IMPORTANT FIX
      status: "Pending"
    });

    const populatedComplaint = await Complaint.findById(newComplaint._id)
      .populate({
        path: "created_by",
        select:
          "first_name last_name name student_id warden_id admin_id student_mobile"
      });

    return res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: populatedComplaint
    });

  } catch (error) {

    console.error("CREATE COMPLAINT ERROR:", error);

    // 🔥 HANDLE DUPLICATE ERROR SAFELY
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate complaint detected. Try again."
      });
    }

    return res.status(500).json({
      message: error.message || "Server error"
    });

  }
};



// ================= GET ALL COMPLAINTS =================
export const getComplaints = async (req, res) => {
  try {

    const complaints = await Complaint.find()
      .populate({
        path: "created_by",
        select:
          "first_name last_name name student_id warden_id admin_id student_mobile"
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(complaints);

  } catch (error) {

    console.error("GET COMPLAINTS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch complaints"
    });

  }
};



// ================= UPDATE STATUS =================
export const updateComplaintStatus = async (req, res) => {
  try {

    const { status, remark } = req.body;

    const role = req.user?.role;

    if (!["admin", "warden"].includes(role)) {
      return res.status(403).json({
        message: "Only admin or warden can update status"
      });
    }

    const validStatuses = ["Pending", "Assigned", "Completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    complaint.status = status;

    if (remark !== undefined) {
      complaint.remark = remark;
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate({
        path: "created_by",
        select:
          "first_name last_name name student_id warden_id admin_id student_mobile"
      });

    return res.status(200).json({
      message: "Status updated successfully",
      complaint: updatedComplaint
    });

  } catch (error) {

    console.error("UPDATE STATUS ERROR:", error);

    return res.status(500).json({
      message: error.message || "Server error"
    });

  }
};