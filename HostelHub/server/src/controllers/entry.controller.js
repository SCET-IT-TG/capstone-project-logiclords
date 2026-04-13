import Entry from "../models/Entry.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";

// ================= CREATE ENTRY (QR SCAN) =================
export const createEntry = async (req, res) => {
  console.log("NEW ENTRY CONTROLLER RUNNING");
  try {
    const { student_id } = req.body;

    let student;

    // ✅ HANDLE BOTH CASES (ObjectId OR custom student_id)
    if (mongoose.Types.ObjectId.isValid(student_id)) {
      student = await Student.findById(student_id).populate("room_id");
    } else {
      student = await Student.findOne({ student_id }).populate("room_id");
    }
    console.log("ROOM DATA:", student.room_id);//add

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentObjectId = student._id;

    // ✅ LAST ENTRY (for IN/OUT toggle)
    const lastEntry = await Entry.findOne({ student_id: studentObjectId })
      .sort({ timestamp: -1 });

    let entry_type = "IN";
    if (lastEntry && lastEntry.entry_type === "IN") {
      entry_type = "OUT";
    }

    // ✅ SAFE SNAPSHOT DATA (VERY IMPORTANT)
    const studentName =
      `${student.first_name || ""} ${student.last_name || ""}`.trim() || "N/A";

    const studentMobile = student.student_mobile || "N/A";

    const blockNo = student.room_id?.block_no || "N/A";
    const roomNo = student.room_id?.room_no || "N/A";

    // ✅ CREATE ENTRY (STORE SNAPSHOT)
    const entry = await Entry.create({
      type: "student",
      student_id: studentObjectId,

      student_name: studentName,
      student_mobile: studentMobile,

      block_no: blockNo,
      room_no: roomNo,

      entry_type,
      timestamp: new Date(),
    });

    res.status(201).json({
      message: `Entry ${entry_type} recorded`,
      entry,
    });

  } catch (error) {
    console.error("CREATE ENTRY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET TODAY ENTRIES =================
export const getTodayEntries = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const entries = await Entry.find({
      timestamp: { $gte: start, $lte: end },
    })
      .populate({
        path: "student_id",
        select: "first_name last_name mobile_number room_id",
        populate: {
          path: "room_id",
          select: "block_no room_no",
        },
      })
      .sort({ timestamp: -1 });

    const formatted = entries.map((e) => {
      // ✅ NAME
      const name =
        e.student_name ||
        `${e.student_id?.first_name || ""} ${e.student_id?.last_name || ""}`.trim() ||
        e.name ||
        "N/A";

      // ✅ MOBILE
      const mobile =
        e.student_mobile ||
        e.student_id?.mobile_number ||
        e.mobile ||
        "N/A";

      // ✅ ROOM
      const room =
        e.block_no && e.room_no
          ? `${e.block_no}-${e.room_no}`
          : e.student_id?.room_id
          ? `${e.student_id.room_id.block_no}-${e.student_id.room_id.room_no}`
          : "N/A";

      // ✅ TIME (SAFE)
      const time = e.timestamp
        ? new Date(e.timestamp).toLocaleString()
        : "N/A";

      return {
        _id: e._id,
        type: e.type,
        entry_type: e.entry_type,
        name,
        mobile,
        room,
        time,
      };
    });

    res.json(formatted);

  } catch (error) {
    console.error("GET TODAY ENTRIES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL HISTORY =================
export const getAllEntries = async (req, res) => {
  try {
    const entries = await Entry.find()
      .populate({
        path: "student_id",
        select: "first_name last_name mobile_number room_id",
        populate: {
          path: "room_id",
          select: "block_no room_no",
        },
      })
      .sort({ timestamp: -1 });

    const formatted = entries.map((e) => {
      const name =
        e.student_name ||
        `${e.student_id?.first_name || ""} ${e.student_id?.last_name || ""}`.trim() ||
        e.name ||
        "N/A";

      const mobile =
        e.student_mobile ||
        e.student_id?.mobile_number ||
        e.mobile ||
        "N/A";

      const room =
        e.block_no && e.room_no
          ? `${e.block_no}-${e.room_no}`
          : e.student_id?.room_id
          ? `${e.student_id.room_id.block_no}-${e.student_id.room_id.room_no}`
          : "N/A";

      const time = e.timestamp
        ? new Date(e.timestamp).toLocaleString()
        : "N/A";

      return {
        _id: e._id,
        type: e.type,
        entry_type: e.entry_type,
        name,
        mobile,
        room,
        time,
      };
    });

    res.json(formatted);

  } catch (error) {
    console.error("GET HISTORY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};