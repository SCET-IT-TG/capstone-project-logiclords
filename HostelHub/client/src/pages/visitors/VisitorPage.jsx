import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

export default function VisitorPage() {

  const token = localStorage.getItem("token");

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

    const res = await axios.get(
      "http://localhost:5000/api/visitors",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setVisitors(res.data);

  };


  // ================= FETCH STUDENTS =================

  const fetchStudents = async () => {

    const res = await axios.get(
      "http://localhost:5000/api/students",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setStudents(res.data);

  };


  useEffect(() => {

    fetchVisitors();
    fetchStudents();

  }, []);


  // ================= ADD VISITOR =================

  const addVisitor = async () => {

    if (!form.visitor_name || !form.mobile_number || !form.visit_date) {
      return alert("Fill required fields");
    }

    await axios.post(
      "http://localhost:5000/api/visitors",
      form,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
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


  // ================= APPROVE VISITOR =================

  const approveVisitor = async (id) => {

    await axios.put(
      `http://localhost:5000/api/visitors/approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchVisitors();

  };


  // ================= CHECK IN =================

  const checkInVisitor = async (id) => {

    await axios.put(
      `http://localhost:5000/api/visitors/checkin/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchVisitors();

  };


  // ================= CHECK OUT =================

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

      <Sidebar/>

      <div className="flex-1 flex flex-col">

        <Navbar/>

        <div className="p-6 bg-gray-100 min-h-screen">

          <h2 className="text-2xl font-bold mb-6">
            Visitor Management
          </h2>


          {/* ================= ADD VISITOR FORM ================= */}

          <div className="bg-white p-5 rounded-xl shadow mb-6">

            <h3 className="font-semibold mb-4">
              Add Visitor
            </h3>

            <div className="grid grid-cols-3 gap-4">

              <input
                type="text"
                placeholder="Visitor Name"
                value={form.visitor_name}
                onChange={(e)=>setForm({...form,visitor_name:e.target.value})}
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Mobile"
                value={form.mobile_number}
                onChange={(e)=>setForm({...form,mobile_number:e.target.value})}
                className="border p-2 rounded"
              />

              <input
                type="date"
                value={form.visit_date}
                onChange={(e)=>setForm({...form,visit_date:e.target.value})}
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Room No (optional)"
                value={form.room_no}
                onChange={(e)=>setForm({...form,room_no:e.target.value})}
                className="border p-2 rounded"
              />

              <select
                value={form.student}
                onChange={(e)=>setForm({...form,student:e.target.value})}
                className="border p-2 rounded"
              >

                <option value="">Assign Student</option>

                {students.map(s=>(
                  <option key={s._id} value={s._id}>
                    {s.first_name} {s.last_name}
                  </option>
                ))}

              </select>

              <input
                type="text"
                placeholder="Purpose"
                value={form.purpose}
                onChange={(e)=>setForm({...form,purpose:e.target.value})}
                className="border p-2 rounded"
              />

            </div>

            <button
              onClick={addVisitor}
              className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded"
            >
              Add Visitor
            </button>

          </div>


          {/* ================= FILTER ================= */}

          <div className="mb-4">

            <button
              onClick={()=>setFilterNoRoom(!filterNoRoom)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              {filterNoRoom ? "Show All Visitors" : "Visitors Without Room"}
            </button>

          </div>


          {/* ================= VISITOR TABLE ================= */}

          <div className="bg-white rounded-xl shadow overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-200">

                <tr>
                  <th className="p-3">Visitor</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Room</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Visit Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredVisitors.map(v=>(

                  <tr key={v._id} className="border-b">

                    <td className="p-3">
                      {v.visitor_name}
                    </td>

                    <td className="p-3">
                      {v.mobile_number}
                    </td>

                    <td className="p-3">
                      {v.room_no || "-"}
                    </td>

                    <td className="p-3">
                      {v.student
                        ? `${v.student.first_name} ${v.student.last_name}`
                        : "-"
                      }
                    </td>

                    <td className="p-3">
                      {new Date(v.visit_date).toLocaleDateString()}
                    </td>

                    <td className="p-3">

                      {v.status === "PENDING" &&
                        <span className="text-yellow-600">Pending</span>
                      }

                      {v.status === "IN" &&
                        <span className="text-blue-600">Checked In</span>
                      }

                      {v.status === "OUT" &&
                        <span className="text-green-600">Checked Out</span>
                      }

                    </td>

                    <td className="p-3 space-x-2">

                      {!v.approved && (
                        <button
                          onClick={()=>approveVisitor(v._id)}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Approve
                        </button>
                      )}

                      {v.status === "PENDING" && v.approved && (
                        <button
                          onClick={()=>checkInVisitor(v._id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Check IN
                        </button>
                      )}

                      {v.status === "IN" && (
                        <button
                          onClick={()=>checkOutVisitor(v._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Check OUT
                        </button>
                      )}

                    </td>

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