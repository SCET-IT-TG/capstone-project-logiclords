import express from "express";
import { createUser } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Only Admin can create users
router.post(
  "/create",
  protect,
  authorizeRoles("admin"),
  createUser
);
//router.post("/create", createUser);

export default router;