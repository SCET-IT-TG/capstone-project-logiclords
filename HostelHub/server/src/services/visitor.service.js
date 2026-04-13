import Visitor from "../models/Visitor.js";
import Student from "../models/Student.js";


// CREATE VISITOR
export const createVisitorService = async (data) => {

  const visitor = new Visitor(data);

  return await visitor.save();

};



// GET ALL VISITORS (ADMIN / WARDEN)
export const getAllVisitorsService = async () => {

  return await Visitor.find()
  .populate("student","first_name last_name student_id room_no")
  .sort({createdAt:-1});

};



// GET VISITORS WITHOUT ROOM
export const getVisitorsWithoutRoomService = async () => {

  return await Visitor.find({
    room_no: null
  }).populate("student","first_name last_name student_id");

};



// GET STUDENT VISITORS
export const getStudentVisitorsService = async (studentId) => {

  const student = await Student.findById(studentId);

  return await Visitor.find({

    approved: true,

    $or: [
      { room_no: student.room_no },
      { student: studentId }
    ]

  }).sort({createdAt:-1});

};



// APPROVE VISITOR
export const approveVisitorService = async (visitorId) => {

  const visitor = await Visitor.findById(visitorId);

  visitor.approved = true;

  return await visitor.save();

};



// CHECK IN VISITOR
export const checkInVisitorService = async (visitorId) => {

  const visitor = await Visitor.findById(visitorId);

  visitor.status = "IN";
  visitor.check_in = new Date();

  return await visitor.save();

};



// CHECK OUT VISITOR
export const checkOutVisitorService = async (visitorId) => {

  const visitor = await Visitor.findById(visitorId);

  visitor.status = "OUT";
  visitor.check_out = new Date();

  return await visitor.save();

};