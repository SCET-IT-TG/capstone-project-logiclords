import Complaint from "../models/Complaint.js";
import { generateId } from "../utils/generateId.js";

export const createComplaintService = async (data) => {
  data.complaint_id = await generateId(Complaint, "C");
  return await Complaint.create(data);
};

export const getComplaintsService = async () => {
  return await Complaint.find()
    .populate("student_id")
    .populate("warden_id");
};

export const resolveComplaintService = async (id) => {
  const complaint = await Complaint.findById(id);
  complaint.complaint_status = "resolved";
  complaint.resolution_date = new Date();
  await complaint.save();
  return complaint;
};