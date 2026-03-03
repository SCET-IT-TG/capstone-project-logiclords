import Visitor from "../models/Visitor.js";

export const createVisitor = async (req, res) => {
  const visitor = await Visitor.create(req.body);
  res.json(visitor);
};

export const getVisitors = async (req, res) => {
  const visitors = await Visitor.find()
    .populate("student_id")
    .populate("approved_by");
  res.json(visitors);
};