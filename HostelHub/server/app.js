import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import connectDB from "./db.js";
import { errorHandler } from "./src/middleware/error.middleware.js";

import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import studentRoutes from "./src/routes/student.routes.js";
import wardenRoutes from "./src/routes/warden.routes.js";
import roomRoutes from "./src/routes/room.routes.js";
import complaintRoutes from "./src/routes/complaint.routes.js";
import feeRoutes from "./src/routes/fee.routes.js";
import visitorRoutes from "./src/routes/visitor.routes.js";
import qrRoutes from "./src/routes/qr.routes.js";

connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes); // ✅ Correct
app.use("/api/wardens", wardenRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/qr", qrRoutes);

// Error middleware
app.use(errorHandler);

export default app;