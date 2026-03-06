import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

export default function StudentVisitors() {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [visitors, setVisitors] = useState([]);

  const [form, setForm] = useState({
    visitor_name: "",
    mobile_number: "",
    visit_date: "",
    purpose: "",
    room_no: ""
  });


  // ================= FETCH VISITORS =================

  const fetchVisitors = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/visitors/student",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setVisitors(res.data);

    } catch (error) {
      console.log(error);
    }

  };


  useEffect(() => {

    fetchVisitors();

  }, []);


  // ================= CREATE VISITOR REQUEST =================

  const createVisitor = async () => {

    if (!form.visitor_name || !form.mobile_number || !form.visit_date) {
      return alert("Fill required fields");
    }

    try {

      await axios.post(
        "http://localhost:5000/api/visitors",
        {
          ...form,
          student: user.id // auto assign student
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setForm({
        visitor_name: "",
        mobile_number: "",
        visit_date: "",
        purpose: "",
        room_no: ""
      });

      fetchVisitors();

    } catch (error) {

      console.log(error);

    }

  };


  return (

    <div className="flex">

      <Sidebar/>

      <div className="flex-1 flex flex-col">

        <Navbar/>

        <div className="p-6 bg-gray-100 min-h-screen">

          <h2 className="text-2xl font-bold mb-6">
            My Visitors
          </h2>


          {/* ================= VISITOR REQUEST FORM ================= */}

          <div className="bg-white p-5 rounded-xl shadow mb-6">

            <h3 className="font-semibold mb-4">
              Create Visitor Request
            </h3>

            <div className="grid grid-cols-3 gap-4">

              <input
                type="text"
                placeholder="Visitor Name"
                value={form.visitor_name}
                onChange={(e)=>
                  setForm({...form,visitor_name:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Mobile Number"
                value={form.mobile_number}
                onChange={(e)=>
                  setForm({...form,mobile_number:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                type="date"
                value={form.visit_date}
                onChange={(e)=>
                  setForm({...form,visit_date:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Room No (optional)"
                value={form.room_no}
                onChange={(e)=>
                  setForm({...form,room_no:e.target.value})
                }
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Purpose"
                value={form.purpose}
                onChange={(e)=>
                  setForm({...form,purpose:e.target.value})
                }
                className="border p-2 rounded"
              />

            </div>

            <button
              onClick={createVisitor}
              className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded"
            >
              Submit Request
            </button>

          </div>


          {/* ================= VISITOR LIST ================= */}

          <div className="bg-white rounded-xl shadow overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-200">

                <tr>
                  <th className="p-3">Visitor</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Room</th>
                  <th className="p-3">Visit Date</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Status</th>
                </tr>

              </thead>

              <tbody>

                {visitors.map(v => (

                  <tr key={v._id} className="border-b">

                    <td className="p-3">
                      {v.visitor_name}
                    </td>

                    <td className="p-3">
                      {v.mobile_number}
                    </td>

                    <td className="p-3">
                      {v.room_no || "Assigned to Student"}
                    </td>

                    <td className="p-3">
                      {new Date(v.visit_date).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      {v.purpose}
                    </td>

                    <td className="p-3">

                      {!v.approved && (
                        <span className="text-yellow-600">
                          Pending Approval
                        </span>
                      )}

                      {v.approved && v.status === "PENDING" && (
                        <span className="text-blue-600">
                          Approved
                        </span>
                      )}

                      {v.status === "IN" && (
                        <span className="text-green-600">
                          Checked In
                        </span>
                      )}

                      {v.status === "OUT" && (
                        <span className="text-gray-600">
                          Completed
                        </span>
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