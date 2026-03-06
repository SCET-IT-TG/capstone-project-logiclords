import Visitor from "../models/Visitor.js";
import Student from "../models/Student.js";


// CREATE VISITOR (ADMIN/WARDEN/STUDENT)

export const createVisitor = async(req,res)=>{

try{

const {visitor_name,mobile_number,room_no,student,visit_date,purpose} = req.body;

const role = req.user.role;

const visitor = new Visitor({

visitor_name,
mobile_number,
room_no: room_no || null,
student: student || null,
visit_date,
purpose,
created_by:req.user.id,
created_by_model: role === "student" ? "Student" : role === "warden" ? "Warden" : "Admin",
approved: role === "student" ? false : true

});

await visitor.save();

res.status(201).json(visitor);

}
catch(err){

res.status(500).json({message:err.message});

}

};




// GET ALL VISITORS (ADMIN / WARDEN)

export const getVisitors = async(req,res)=>{

try{

const visitors = await Visitor.find()
.populate("student","first_name last_name student_id room_no")
.sort({createdAt:-1});

res.json(visitors);

}
catch(err){

res.status(500).json({message:err.message});

}

};




// GET STUDENT VISITORS

export const getStudentVisitors = async(req,res)=>{

try{

const studentId = req.user.id;

const student = await Student.findById(studentId);

const visitors = await Visitor.find({

approved:true,

$or:[
{room_no:student.room_no},
{student:studentId}
]

});

res.json(visitors);

}
catch(err){

res.status(500).json({message:err.message});

}

};




// APPROVE VISITOR

export const approveVisitor = async(req,res)=>{

try{

const visitor = await Visitor.findById(req.params.id);

visitor.approved=true;

await visitor.save();

res.json(visitor);

}
catch(err){

res.status(500).json({message:err.message});

}

};




// CHECK IN

export const checkInVisitor = async(req,res)=>{

try{

const visitor = await Visitor.findById(req.params.id);

visitor.status="IN";
visitor.check_in=new Date();

await visitor.save();

res.json(visitor);

}
catch(err){

res.status(500).json({message:err.message});

}

};




// CHECK OUT

export const checkOutVisitor = async(req,res)=>{

try{

const visitor = await Visitor.findById(req.params.id);

visitor.status="OUT";
visitor.check_out=new Date();

await visitor.save();

res.json(visitor);

}
catch(err){

res.status(500).json({message:err.message});

}

};