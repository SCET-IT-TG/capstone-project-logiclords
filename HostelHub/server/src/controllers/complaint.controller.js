import Complaint from "../models/Complaint.js";

export const createComplaint = async (req, res) => {
  const complaint = await Complaint.create(req.body);
  res.json(complaint);
};

export const getComplaints = async (req, res) => {
  const complaints = await Complaint.find()
    .populate("student_id")
    .populate("warden_id");
  res.json(complaints);
};

export const resolveComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  complaint.complaint_status = "resolved";
  complaint.resolution_date = new Date();
  await complaint.save();
  res.json(complaint);
};