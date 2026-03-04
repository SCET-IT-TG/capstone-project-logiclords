import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";

export default function AdminDashboard() {

  const [students, setStudents] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState(""); // students | wardens

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {

      const studentRes = await axios.get(
        "http://localhost:5000/api/students",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const wardenRes = await axios.get(
        "http://localhost:5000/api/wardens",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const roomRes = await axios.get(
        "http://localhost:5000/api/rooms",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStudents(studentRes.data);
      setWardens(wardenRes.data);
      setRooms(roomRes.data);

    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">

        <div onClick={() => setView("students")} className="cursor-pointer">
          <StatCard
            title="Students"
            value={students.length}
            color="#6366f1"
          />
        </div>

        <div onClick={() => setView("wardens")} className="cursor-pointer">
          <StatCard
            title="Wardens"
            value={wardens.length}
            color="#22c55e"
          />
        </div>

        <StatCard
          title="Rooms"
          value={rooms.length}
          color="#f97316"
        />

        <StatCard
          title="Entries Today"
          value="--"
          color="#ec4899"
        />

      </div>


      {/* Student Table */}
      {view === "students" && (
        <div className="bg-white shadow rounded p-4 mb-8">

          <h2 className="text-xl font-semibold mb-4">
            Student List
          </h2>

          <table className="w-full border">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Student ID</th>
                <th className="p-2 border">Enrollment</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Mobile</th>
                <th className="p-2 border">Room</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td className="p-2 border">{s.student_id}</td>
                  <td className="p-2 border">{s.enrollment_no}</td>
                  <td className="p-2 border">
                    {s.first_name} {s.last_name}
                  </td>
                  <td className="p-2 border">{s.email}</td>
                  <td className="p-2 border">{s.mobile_number}</td>
                  <td className="p-2 border">
                    {s.room_id?.roomNumber || "Not Allocated"}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}


      {/* Warden Table */}
      {view === "wardens" && (
        <div className="bg-white shadow rounded p-4">

          <h2 className="text-xl font-semibold mb-4">
            Warden List
          </h2>

          <table className="w-full border">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Warden ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Block</th>
              </tr>
            </thead>

            <tbody>
              {wardens.map((w) => (
                <tr key={w._id}>
                  <td className="p-2 border">{w.warden_id}</td>
                  <td className="p-2 border">
                    {w.first_name} {w.last_name}
                  </td>
                  <td className="p-2 border">{w.email}</td>
                  <td className="p-2 border">{w.assigned_block}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </DashboardLayout>
  );
}