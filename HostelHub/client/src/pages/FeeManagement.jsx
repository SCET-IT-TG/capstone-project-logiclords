import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function FeeManagement() {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/fees/admin", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setStudents(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, [token]);


  const totalFees = students.reduce(
    (sum, s) => sum + (s.total_fee || 0),
    0
  );

  const totalPaid = students.reduce(
    (sum, s) => sum + (s.paid_amount || 0),
    0
  );

  const totalDue = students.reduce(
    (sum, s) => sum + (s.due_amount || 0),
    0
  );


  // 🔒 Only admin can see page
  if (user?.role !== "admin") {
    return (
      <div className="p-10 text-center text-red-500 text-xl font-semibold">
        Access Denied
      </div>
    );
  }


  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <div className="p-6 bg-gray-100 min-h-screen">

          <h2 className="text-2xl font-bold mb-6">
            Fee Management
          </h2>


          {/* ===== DASHBOARD CARDS ===== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Total Fees</p>
              <h3 className="text-3xl font-bold text-indigo-600 mt-2">
                ₹{totalFees.toLocaleString()}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Collected</p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">
                ₹{totalPaid.toLocaleString()}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Pending</p>
              <h3 className="text-3xl font-bold text-red-500 mt-2">
                ₹{totalDue.toLocaleString()}
              </h3>
            </div>

          </div>


          {/* ===== STUDENT TABLE ===== */}

          <div className="bg-white rounded-xl shadow overflow-x-auto">

            {loading ? (

              <p className="text-center py-10 text-gray-500">
                Loading fee data...
              </p>

            ) : (

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>
                    <th className="p-4 text-left">Student ID</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Total Fee</th>
                    <th className="p-4 text-left">Paid</th>
                    <th className="p-4 text-left">Due</th>
                  </tr>

                </thead>

                <tbody>

                  {students.map((s) => (

                    <tr key={s._id} className="border-b hover:bg-gray-50">

                      <td className="p-4 font-medium">
                        {s.student_id}
                      </td>

                      <td className="p-4">
                        {s.first_name} {s.last_name}
                      </td>

                      <td className="p-4 text-indigo-600 font-semibold">
                        ₹{(s.total_fee || 0).toLocaleString()}
                      </td>

                      <td className="p-4 text-green-600 font-semibold">
                        ₹{(s.paid_amount || 0).toLocaleString()}
                      </td>

                      <td className="p-4 text-red-500 font-semibold">
                        ₹{(s.due_amount || 0).toLocaleString()}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}