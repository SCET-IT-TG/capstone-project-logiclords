import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";

export default function WardenDashboard() {

  const [students, setStudents] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [entries, setEntries] = useState([]);
  const [view, setView] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState(""); // ✅ ADD

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ================= FETCH =================
  const fetchDashboardData = useCallback(async () => {
    try {
      const studentRes = await axios.get(
        "http://localhost:5000/api/students",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(studentRes.data);
    } catch {}

    try {
      const wardenRes = await axios.get(
        "http://localhost:5000/api/wardens",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWardens(wardenRes.data);
    } catch {}

    try {
      const roomRes = await axios.get(
        "http://localhost:5000/api/rooms",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRooms(roomRes.data);
    } catch {}

    try {
      const entryRes = await axios.get(
        "http://localhost:5000/api/entries/today",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEntries(entryRes.data);
    } catch {}
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ================= HANDLERS =================
  const handleEditRoom = (id) => {
    navigate(`/edit-room/${id}`);
  };

  const handleEditStudentRoom = (id) => {
    navigate(`/edit-student/${id}`); // 👉 only room edit page
  };
const formatDateTime = (date) => {
  if (!date) return "N/A";

  const d = new Date(date);

  const formattedDate = d.toLocaleDateString("en-GB"); // dd/mm/yyyy
  const formattedTime = d.toLocaleTimeString(); // time same

  return `${formattedDate} || ${formattedTime}`;
};
  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Warden Dashboard</h1>

        {(view === "students" || view === "rooms") && (
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded text-white ${
              editMode ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {editMode ? "Exit Edit Mode" : "Enable Edit Mode"}
          </button>
        )}
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">

        <div onClick={() => setView("students")} className="cursor-pointer hover:scale-105">
          <StatCard title="Students" value={students.length} color="#6366f1" />
        </div>

        <div onClick={() => setView("wardens")} className="cursor-pointer hover:scale-105">
          <StatCard title="Wardens" value={wardens.length} color="#22c55e" />
        </div>

        <div onClick={() => setView("rooms")} className="cursor-pointer hover:scale-105">
          <StatCard title="Rooms" value={rooms.length} color="#f97316" />
        </div>

        <div onClick={() => setView("entries")} className="cursor-pointer hover:scale-105">
          <StatCard title="Entries Today" value={entries.length} color="#ec4899" />
        </div>

      </div>

      {/* ================= STUDENTS ================= */}
      {view === "students" && (
        <div className="bg-white shadow rounded p-4 mb-8 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Student List</h2>
          <input
  type="text"
  placeholder="Search name / mobile / room..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="mb-4 p-2 border rounded w-64"
/>

          <table className="w-full border">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Mobile</th>
                <th className="p-2 border">Room</th>
                {editMode && <th className="p-2 border">Action</th>}
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td className="p-2 border">{s.student_id}</td>
                  <td className="p-2 border">
                    {s.first_name} {s.last_name}
                  </td>
                  <td className="p-2 border">{s.student_mobile}</td>

                  <td className="p-2 border">
                    {s.room_id
                      ? `${s.room_id.block_no}-${s.room_id.room_no}`
                      : "Not Allocated"}
                  </td>

                  {editMode && (
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => handleEditStudentRoom(s._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit Room
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= WARDENS (VIEW ONLY) ================= */}
      {view === "wardens" && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Warden List</h2>
<input
  type="text"
  placeholder="Search name / block..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="mb-4 p-2 border rounded w-64"
/>
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
                  <td className="p-2 border">{w.first_name} {w.last_name}</td>
                  <td className="p-2 border">{w.email}</td>
                  <td className="p-2 border">{w.assigned_block}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ROOMS ================= */}
      {view === "rooms" && (
        <div className="bg-white shadow rounded p-4 mb-8 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Room List</h2>
<input
  type="text"
  placeholder="Search room / block / type..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="mb-4 p-2 border rounded w-64"
/>
          <table className="w-full border">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-2 border">Block</th>
                <th className="p-2 border">Room No</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Capacity</th>
                <th className="p-2 border">Occupied</th>
                {editMode && <th className="p-2 border">Action</th>}
              </tr>
            </thead>

            <tbody>
              {rooms.map((r) => (
                <tr key={r._id}>
                  <td className="p-2 border">{r.block_no}</td>
                  <td className="p-2 border">{r.room_no}</td>
                  <td className="p-2 border">{r.room_type}</td>
                  <td className="p-2 border">{r.capacity}</td>
                  <td className="p-2 border">{r.occupied_beds}</td>

                  {editMode && (
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => handleEditRoom(r._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ENTRIES ================= */}
      {view === "entries" && (
        <div className="bg-white shadow rounded p-4 mb-8 overflow-x-auto">

          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Entries Today</h2>

            <button
              onClick={() => navigate("/entry-history")}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              📜 View History
            </button>
          </div>

          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Room</th>
                <th className="p-2 border">Time</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((e) => (
                <tr key={e._id}>
                  <td className="p-2 border">{e.entry_type}</td>
                  <td className="p-2 border">{e.name}</td>
                  <td className="p-2 border">{e.room}</td>
                  <td className="p-2 border">
  {formatDateTime(e.time)}
</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

    </DashboardLayout>
  );
}