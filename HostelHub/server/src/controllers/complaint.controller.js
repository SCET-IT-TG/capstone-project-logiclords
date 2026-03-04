import Complaint from "../models/Complaint.js";


// ================= CREATE COMPLAINT =================
export const createComplaint = async (req, res) => {
  try {

    const { complaint } = req.body;

    if (!complaint) {
      return res.status(400).json({ message: "Complaint text required" });
    }

    const role = req.user.role;

    if (role !== "student" && role !== "warden") {
      return res
        .status(403)
        .json({ message: "Only student or warden can create complaints" });
    }

    const model = role === "warden" ? "Warden" : "Student";

    const newComplaint = new Complaint({
      created_by: req.user.id,
      created_by_model: model,
      complaint,
      status: "Pending"
    });

    await newComplaint.save();

    // populate user details before sending response
    const populatedComplaint = await Complaint.findById(newComplaint._id)
      .populate({
        path: "created_by",
        select:
          "first_name last_name name student_id warden_id admin_id mobile_number"
      });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: populatedComplaint
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
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
          "first_name last_name name student_id warden_id admin_id mobile_number"
      })
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch complaints"
    });

  }
};



// ================= UPDATE STATUS =================
export const updateComplaintStatus = async (req, res) => {
  try {

    const { status, remark } = req.body;

    const role = req.user.role;

    if (role !== "admin" && role !== "warden") {
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
          "first_name last_name name student_id warden_id admin_id mobile_number"
      });

    res.json({
      message: "Status updated successfully",
      complaint: updatedComplaint
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};