import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import connectDB from "./db.js";
import { errorHandler } from "./src/middleware/error.middleware.js";
import path from "path";

// ROUTES
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import studentRoutes from "./src/routes/student.routes.js";
import wardenRoutes from "./src/routes/warden.routes.js";
import roomRoutes from "./src/routes/room.routes.js";
import complaintRoutes from "./src/routes/complaint.routes.js";
import feeRoutes from "./src/routes/fee.routes.js";
import visitorRoutes from "./src/routes/visitor.routes.js";
import qrRoutes from "./src/routes/qr.routes.js";
import entryRoutes from "./src/routes/entry.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";



// CONNECT DATABASE
connectDB();

const app = express();


// ======================================
// GLOBAL MIDDLEWARE
// ======================================

// ✅ CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ✅ BODY PARSER
app.use(express.json());

// ✅ COOKIE PARSER
app.use(cookieParser());

// ✅ STATIC FILES (VERY IMPORTANT FOR QR)
app.use("/uploads", express.static("uploads"));


// ======================================
// API ROUTES
// ======================================

app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/wardens", wardenRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/qr", qrRoutes);
app.use((req, res, next) => {
  console.log(`🌐 Incoming Request: ${req.method} ${req.url}`);
  next();
});
app.use("/api/entries", entryRoutes);
// ======================================
// HEALTH CHECK
// ======================================

app.get("/", (req, res) => {
  res.send("Smart Hostel Management API Running...");
});

console.log("STATIC PATH:", path.join(process.cwd(), "src", "uploads"));
// ✅ STATIC FOLDER FIX
app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "src", "uploads")
  )
);
app.use("/api/profile", profileRoutes);
// ======================================
// ERROR HANDLER
// ======================================

app.use(errorHandler);


// ======================================
// EXPORT
// ======================================

export default app;