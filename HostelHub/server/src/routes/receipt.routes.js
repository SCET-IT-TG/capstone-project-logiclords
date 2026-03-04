import express from "express";
import { generateReceipt } from "../controllers/receipt.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:id", protect, generateReceipt);

export default router;