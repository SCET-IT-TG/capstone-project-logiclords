import express from "express";
import {
  createWarden,
  getWardens,
  updateWardenPhoto
} from "../controllers/warden.controller.js";

const router = express.Router();

router.post("/create", createWarden);
router.get("/", getWardens);
router.put("/photo", updateWardenPhoto);

export default router;