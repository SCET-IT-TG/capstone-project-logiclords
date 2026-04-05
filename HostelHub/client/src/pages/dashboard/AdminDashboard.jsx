import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";

export default function AdminDashboard() {

  const [students, setStudents] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [entries, setEntries] = useState([]);
  const [view, setView] = useState("");
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);

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
  } catch (err) {
    console.error("Student API Error", err);
  }

  try {
    const wardenRes = await axios.get(
      "http://localhost:5000/api/wardens",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setWardens(wardenRes.data);
  } catch (err) {
    console.error("Warden API Error", err);
  }

  try {
    const roomRes = await axios.get(
      "http://localhost:5000/api/rooms",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRooms(roomRes.data);
  } catch (err) {
    console.error("Room API Error", err);
  }

  try {
    const entryRes = await axios.get(
      "http://localhost:5000/api/entries/today",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEntries(entryRes.data);
  } catch (err) {
    console.error("Entry API Error", err);
  }
}, [token]);
useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ================= STUDENT =================
  const handleEditStudent = (id) => {
    navigate(`/edit-student/${id}`);
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/students/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData();
    } catch {
      alert("Delete failed");
    }
  };

  // ================= WARDEN =================
  const handleEditWarden = (id) => {
    navigate(`/edit-warden/${id}`);
  };

  const handleDeleteWarden = async (id) => {
    if (!window.confirm("Delete this warden?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/wardens/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData();
    } catch {
      alert("Delete failed");
    }
  };

  // ================= ROOM =================
  const handleEditRoom = (id) => {
    navigate(`/edit-room/${id}`); // ✅ FIXED
  };

  const handleDeleteRoom = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/rooms/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        

        {(view === "students" || view === "wardens" || view === "rooms") && (
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

        <div onClick={() => { setView("students"); setEditMode(false); }}
          className="cursor-pointer hover:scale-105">
          <StatCard title="Students" value={students.length} color="#6366f1" />
        </div>

        <div onClick={() => { setView("wardens"); setEditMode(false); }}
          className="cursor-pointer hover:scale-105">
          <StatCard title="Wardens" value={wardens.length} color="#22c55e" />
        </div>

        <div onClick={() => { setView("rooms"); setEditMode(false); }}
          className="cursor-pointer hover:scale-105">
          <StatCard title="Rooms" value={rooms.length} color="#f97316" />
        </div>

        <div onClick={() => { setView("entries"); setEditMode(false); }}
          className="cursor-pointer hover:scale-105">
          <StatCard title="Entries Today" value={entries.length} color="#ec4899" />
        </div>

      </div>

      {/* ================= STUDENTS ================= */}
      {view === "students" && (
        <div className="bg-white shadow rounded p-4 mb-8 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Student List</h2>
          <input
  type="text"
  placeholder="Search (Name / Mobile / Room)..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="mb-4 p-2 border rounded w-80"
/>

          <table className="w-full border">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Student Mobile</th>
                <th className="p-2 border">Parent Mobile</th>
                <th className="p-2 border">Room</th>
                {editMode && <th className="p-2 border">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {students
  .filter((s) => {
    const text = search.toLowerCase();

    const name = `${s.first_name} ${s.middle_name} ${s.last_name}`.toLowerCase();
    const mobile = s.student_mobile?.toLowerCase() || "";
    const room = s.room_id
      ? `${s.room_id.block_no}-${s.room_id.room_no}`.toLowerCase()
      : "";

    return (
      name.includes(text) ||
      mobile.includes(text) ||
      room.includes(text)
    );
  })
  .map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{s.student_id}</td>
                  <td className="p-2 border">
                    {s.first_name} {s.middle_name} {s.last_name}
                  </td>
                  <td className="p-2 border">{s.email}</td>
                  <td className="p-2 border">{s.student_mobile}</td>
                  <td className="p-2 border">{s.parent_mobile}</td>
                  <td className="p-2 border">
                    {s.room_id && s.room_id.block_no
                      ? `${s.room_id.block_no}-${s.room_id.room_no}`
                      : "Not Allocated"}
                  </td>

                  {editMode && (
                    <td className="p-2 border space-x-2 text-center">
                      <button
                        onClick={() => handleEditStudent(s._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteStudent(s._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= WARDENS ================= */}
      {view === "wardens" && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Warden List</h2>
          <input
  type="text"
  placeholder="Search (Name / Block)..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="mb-4 p-2 border rounded w-80"
/>

          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Warden ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Block</th>
                {editMode && <th className="p-2 border">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {wardens
  .filter((w) => {
    const text = search.toLowerCase();

    const name = `${w.first_name} ${w.last_name}`.toLowerCase();

    // ✅ HANDLE ARRAY / STRING / NUMBER
    let block = "";
    if (Array.isArray(w.assigned_block)) {
      block = w.assigned_block.join(" ").toLowerCase();
    } else {
      block = (w.assigned_block || "").toString().toLowerCase();
    }

    return name.includes(text) || block.includes(text);
  })
  .map((w) => (
                <tr key={w._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{w.warden_id}</td>
                  <td className="p-2 border">
                    {w.first_name} {w.last_name}
                  </td>
                  <td className="p-2 border">{w.email}</td>
                  <td className="p-2 border">{w.assigned_block}</td>

                  {editMode && (
                    <td className="p-2 border space-x-2 text-center">
                      <button
                        onClick={() => handleEditWarden(w._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteWarden(w._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ROOMS ================= */}
      {view === "rooms" && (
        <div className="bg-white shadow rounded p-4 mb-8 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Room List</h2>
            

            <button
              onClick={() => navigate("/add-room")}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              + Add Room
            </button>
            
          </div>
          <input
              type="text"
              placeholder="Search (Room / Block / Type)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-2 mb-4 p-2 border rounded w-80"
            />
          <table className="w-full border">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-2 border">Block</th>
                <th className="p-2 border">Room No</th>
                <th className="p-2 border">Room Type</th>
                <th className="p-2 border">Capacity</th>
                <th className="p-2 border">Occupied</th>
                <th className="p-2 border">Status</th>
                {editMode && <th className="p-2 border">Actions</th>}
              </tr>
            </thead>

            <tbody>
             {rooms
  .filter((r) => {
    const text = search.toLowerCase();

    const roomNo = r.room_no?.toString().toLowerCase() || "";
    const block = r.block_no?.toLowerCase() || "";
    const type = r.room_type?.toLowerCase() || "";

    return (
      roomNo.includes(text) ||
      block.includes(text) ||
      type.includes(text)
    );
  })
  .map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">

                  <td className="p-2 border">{r.block_no}</td>
                  <td className="p-2 border">{r.room_no}</td>

                  <td className="p-2 border">
                    {r.room_type === "AC" ? "AC" : "Non-AC"}
                  </td>

                  <td className="p-2 border">{r.capacity}</td>
                  <td className="p-2 border">{r.occupied_beds}</td>

                  <td className="p-2 border">
                    {r.occupied_beds >= r.capacity ? "Full" : "Available"}
                  </td>

                  {editMode && (
                    <td className="p-2 border space-x-2 text-center">
                      <button
                        onClick={() => handleEditRoom(r._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteRoom(r._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
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
                  <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Entries Today</h2>

          <button
            onClick={() => navigate("/entry-history")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            View History
          </button>
        </div>

          <table className="w-full border">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Mobile</th>
                <th className="p-2 border">Room</th>
                <th className="p-2 border">Time</th>
              </tr>
            </thead>

            <tbody>
  {entries.length === 0 ? (
    <tr>
      <td colSpan="5" className="p-4">
        No entries found
      </td>
    </tr>
  ) : (
    entries.map((e) => {
      const name =
        e.name ||
        e.student_name ||
        (e.student_id
          ? `${e.student_id.first_name || ""} ${e.student_id.last_name || ""}`
          : "Visitor");
const formatDateTime = (date) => {
  if (!date) return "N/A";

  const d = new Date(date);

  const formattedDate = d.toLocaleDateString("en-GB"); // dd/mm/yyyy
  const formattedTime = d.toLocaleTimeString(); // time same

  return `${formattedDate}  ||  ${formattedTime}`;
};
      
      return (
        <tr key={e._id} className="hover:bg-gray-50">
          <td className="p-2 border">{e.entry_type || e.type}</td>
          <td className="p-2 border">{name}</td>
          <td className="p-2 border">{e.mobile}</td>
          <td className="p-2 border">{e.room || "N/A"}</td>
          <td className="p-2 border">
  {formatDateTime(e.time)}
</td>
        </tr>
      );
    })
  )}
</tbody>
          </table>
        </div>
      )}

    </DashboardLayout>
  );
}