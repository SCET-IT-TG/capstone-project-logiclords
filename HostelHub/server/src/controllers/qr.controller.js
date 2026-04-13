import QrEntryLog from "../models/QrEntryLog.js";

export const createEntry = async (req, res) => {
  const entry = await QrEntryLog.create(req.body);
  res.json(entry);
};

export const getEntries = async (req, res) => {
  const entries = await QrEntryLog.find()
    .populate("student_id")
    .populate("verified_by");
  res.json(entries);
};