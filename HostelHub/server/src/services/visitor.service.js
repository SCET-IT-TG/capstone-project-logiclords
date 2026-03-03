import Visitor from "../models/Visitor.js";
import { generateId } from "../utils/generateId.js";

export const createVisitorService = async (data) => {
  data.visitor_id = await generateId(Visitor, "V");
  return await Visitor.create(data);
};

export const getVisitorsService = async () => {
  return await Visitor.find()
    .populate("student_id")
    .populate("approved_by");
};