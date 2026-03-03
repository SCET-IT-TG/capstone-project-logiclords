import User from "../models/user.model.js";
import Room from "../models/room.model.js";
import Complaint from "../models/complaint.model.js";
import QRLog from "../models/qrLog.model.js";

export const getDashboardStats = async () => {

  // Users count
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalWardens = await User.countDocuments({ role: "warden" });

  // Rooms
  const totalRooms = await Room.countDocuments();
  const fullRooms = await Room.countDocuments({ roomStatus: "full" });

  const occupancyRate =
    totalRooms === 0
      ? 0
      : ((fullRooms / totalRooms) * 100).toFixed(1);

  // Complaints
  const pendingComplaints =
    await Complaint.countDocuments({ status: "pending" });

  const resolvedComplaints =
    await Complaint.countDocuments({ status: "resolved" });

  // Today Entry Logs
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayEntries = await QRLog.countDocuments({
    createdAt: { $gte: today }
  });

  return {
    totalStudents,
    totalWardens,
    totalRooms,
    fullRooms,
    occupancyRate,
    pendingComplaints,
    resolvedComplaints,
    todayEntries
  };
};