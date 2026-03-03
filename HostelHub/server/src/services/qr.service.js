import QrEntryLog from "../models/QrEntryLog.js";
import { generateId } from "../utils/generateId.js";

export const createEntryService = async (data) => {
  data.entry_id = await generateId(QrEntryLog, "E");
  return await QrEntryLog.create(data);
};

export const getEntriesService = async () => {
  return await QrEntryLog.find()
    .populate("student_id")
    .populate("verified_by");
};