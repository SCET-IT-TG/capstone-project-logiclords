import express from "express";

import {
createVisitor,
getVisitors,
getStudentVisitors,
approveVisitor,
checkInVisitor,
checkOutVisitor
}
from "../controllers/visitor.controller.js";

import {protect} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/",protect,createVisitor);

router.get("/",protect,getVisitors);

router.get("/student",protect,getStudentVisitors);

router.put("/approve/:id",protect,approveVisitor);

router.put("/checkin/:id",protect,checkInVisitor);

router.put("/checkout/:id",protect,checkOutVisitor);

export default router;