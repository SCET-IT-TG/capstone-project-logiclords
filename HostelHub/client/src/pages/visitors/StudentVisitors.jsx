import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

export default function VisitorPage() {
  // DATE FORMAT FUNCTION (add above return)
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB");
};
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [visitors, setVisitors] = useState([]);
  const [students, setStudents] = useState([]);
  const [filterNoRoom, setFilterNoRoom] = useState(false);

  const [form, setForm] = useState({
    visitor_name: "",
    mobile_number: "",
    room_no: "",
    student: "",
    visit_date: "",
    purpose: ""
  });

  // ================= FETCH VISITORS =================
  const fetchVisitors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/visitors",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVisitors(res.data);
    } catch (err) {
      console.error("VISITOR ERROR:", err);
    }
  };

  // ================= FETCH STUDENTS =================
  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/students",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(res.data);
    } catch (err) {
      console.log("Student fetch blocked (normal for student role)");
    }
  };

  // ================= USE EFFECT =================
  useEffect(() => {

    fetchVisitors();

    // 🔥 FIX: only admin/warden
    if (role === "admin" || role === "warden") {
      fetchStudents();
    }

  }, []);

  // ================= ADD VISITOR =================
  const addVisitor = async () => {

    if (!form.visitor_name || !form.mobile_number || !form.visit_date) {
      return alert("Fill required fields");
    }

    await axios.post(
      "http://localhost:5000/api/visitors",
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setForm({
      visitor_name: "",
      mobile_number: "",
      room_no: "",
      student: "",
      visit_date: "",
      purpose: ""
    });

    fetchVisitors();
  };

  // ================= ACTIONS =================
  const approveVisitor = async (id) => {
    await axios.put(
      `http://localhost:5000/api/visitors/approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchVisitors();
  };

  const checkInVisitor = async (id) => {
    await axios.put(
      `http://localhost:5000/api/visitors/checkin/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchVisitors();
  };

  const checkOutVisitor = async (id) => {
    await axios.put(
      `http://localhost:5000/api/visitors/checkout/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchVisitors();
  };

  const filteredVisitors = filterNoRoom
    ? visitors.filter(v => !v.room_no)
    : visitors;

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <div className="p-6 bg-gray-100 min-h-screen">

          <h2 className="text-2xl font-bold mb-6">
            Visitor Management
          </h2>

          {/* FORM */}
          <div className="bg-white p-5 rounded-xl shadow mb-6">

            <h3 className="font-semibold mb-4">Add Visitor</h3>

            <div className="grid grid-cols-3 gap-4">

              <input
                placeholder="Visitor Name"
                value={form.visitor_name}
                onChange={(e)=>setForm({...form,visitor_name:e.target.value})}
                className="border p-2"
              />

              <input
                placeholder="Mobile"
                value={form.mobile_number}
                onChange={(e)=>setForm({...form,mobile_number:e.target.value})}
                className="border p-2"
              />

              <input
                type="date"
                value={form.visit_date}
                onChange={(e)=>setForm({...form,visit_date:e.target.value})}
                className="border p-2"
              />

              <input
                placeholder="Room No"
                value={form.room_no}
                onChange={(e)=>setForm({...form,room_no:e.target.value})}
                className="border p-2"
              />

              {/* 🔥 ONLY ADMIN/WARDEN */}
              {(role === "admin" || role === "warden") && (
                <select
                  value={form.student}
                  onChange={(e)=>setForm({...form,student:e.target.value})}
                  className="border p-2"
                >
                  <option value="">Assign Student</option>
                  {students.map(s=>(
                    <option key={s._id} value={s._id}>
                      {s.first_name} {s.last_name}
                    </option>
                  ))}
                </select>
              )}

              <input
                placeholder="Purpose"
                value={form.purpose}
                onChange={(e)=>setForm({...form,purpose:e.target.value})}
                className="border p-2"
              />

            </div>

            <button
              onClick={addVisitor}
              className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded"
            >
              Add Visitor
            </button>

          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">

  <table className="w-full">

    <thead className="bg-gray-100 text-gray-600">
      <tr>
        <th className="p-3 text-left">Visitor</th>
        <th className="p-3 text-left">Mobile</th>
        <th className="p-3 text-left">Room</th>
        <th className="p-3 text-left">Student</th>
        <th className="p-3 text-left">Date</th>
        <th className="p-3 text-left">Status</th>
        <th className="p-3 text-left">Check-IN</th>
        <th className="p-3 text-left">Check-OUT</th>
        {(role === "admin" || role === "warden") && (
          <th className="p-3 text-left">Action</th>
        )}
      </tr>
    </thead>

    <tbody>

      {filteredVisitors.map(v => (

        <tr key={v._id} className="border-b hover:bg-gray-50 transition">

          <td className="p-3 font-medium">{v.visitor_name}</td>

          <td className="p-3">{v.mobile_number}</td>

          <td className="p-3">{v.room_no || "-"}</td>

          <td className="p-3">
            {v.student
              ? `${v.student.first_name} ${v.student.last_name}`
              : "-"
            }
          </td>

          {/* ✅ FORMATTED DATE */}
          <td className="p-3">
            {formatDate(v.visit_date)}
          </td>

          {/* ✅ STATUS BADGE */}
          <td className="p-3">
            {v.status === "PENDING" && (
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                Pending
              </span>
            )}
            {v.status === "IN" && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                Checked In
              </span>
            )}
            {v.status === "OUT" && (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                Completed
              </span>
            )}
          </td>

          {/* ✅ TIME FORMAT */}
          <td className="p-3">
            {v.check_in
              ? new Date(v.check_in).toLocaleTimeString("en-GB")
              : "-"
            }
          </td>

          <td className="p-3">
            {v.check_out
              ? new Date(v.check_out).toLocaleTimeString("en-GB")
              : "-"
            }
          </td>

          {(role === "admin" || role === "warden") && (
            <td className="p-3 space-x-2">

              {!v.approved && (
                <button
                  onClick={() => approveVisitor(v._id)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                >
                  Approve
                </button>
              )}

              {v.status === "PENDING" && v.approved && (
                <button
                  onClick={() => checkInVisitor(v._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  Check IN
                </button>
              )}

              {v.status === "IN" && (
                <button
                  onClick={() => checkOutVisitor(v._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Check OUT
                </button>
              )}

            </td>
          )}

        </tr>

      ))}

    </tbody>

  </table>

</div>

        </div>

      </div>

    </div>
  );
}