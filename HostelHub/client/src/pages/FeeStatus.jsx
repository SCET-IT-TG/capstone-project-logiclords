import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function FeeStatus() {

  const [data, setData] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/fees/student", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setData(res.data))
      .catch(err => console.log(err));

  }, [token]);


  if (!data) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading fee details...
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
            My Fee Status
          </h2>


          {/* ===== FEE SUMMARY ===== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Total Fee</p>
              <h3 className="text-3xl font-bold text-indigo-600 mt-2">
                ₹{data.student.total_fee}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Paid</p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">
                ₹{data.student.paid_amount}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Due</p>
              <h3 className="text-3xl font-bold text-red-500 mt-2">
                ₹{data.due_amount}
              </h3>
            </div>

          </div>


          {/* ===== PAYMENT HISTORY ===== */}

          <div className="bg-white rounded-xl shadow p-4">

            <h3 className="text-lg font-semibold mb-4">
              Payment History
            </h3>

            {data.history.length === 0 ? (

              <p className="text-gray-500 text-center py-6">
                No payments recorded
              </p>

            ) : (

              <table className="w-full">

                <thead className="bg-gray-100 text-gray-600">

                  <tr>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Payment Method</th>
                    <th className="p-3 text-left">Receipt</th>
                  </tr>

                </thead>

                <tbody>

                  {data.history.map((p) => (

                    <tr
                      key={p._id}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      <td className="p-3 text-green-600 font-semibold">
                        ₹{p.amount}
                      </td>

                      <td className="p-3">
                        {p.payment_method}
                      </td>

                      <td className="p-3">

                        <button
                          onClick={() =>
                            window.open(`http://localhost:5000/api/receipt/${p._id}`)
                          }
                          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                        >
                          Download
                        </button>

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