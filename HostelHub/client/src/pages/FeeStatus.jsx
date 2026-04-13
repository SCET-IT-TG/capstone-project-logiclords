import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function FeeStatus() {
  const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ================= FETCH DATA =================
  useEffect(() => {

    const fetchFees = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/fees/student",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setData(res.data);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // 🔥 IMPORTANT
      }
    };

    fetchFees();

  }, []); // 🔥 FIX: removed token dependency


  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <div className="p-6 bg-gray-100 min-h-screen">

          <h2 className="text-2xl font-bold mb-6">
            My Fee Status
          </h2>

          {/* 🔥 LOADING FIX */}
          {loading ? (

            <div className="text-center text-gray-500 py-10">
              Loading fee details...
            </div>

          ) : (

            <>
              {/* ===== FEE SUMMARY ===== */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                <div className="bg-white p-6 rounded-xl shadow">
                  <p className="text-gray-500 text-sm">Total Fee</p>
                  <h3 className="text-3xl font-bold text-indigo-600 mt-2">
                    ₹{data?.student?.total_fee || 0}
                  </h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                  <p className="text-gray-500 text-sm">Paid</p>
                  <h3 className="text-3xl font-bold text-green-600 mt-2">
                    ₹{data?.student?.paid_amount || 0}
                  </h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                  <p className="text-gray-500 text-sm">Due</p>
                  <h3 className="text-3xl font-bold text-red-500 mt-2">
                    ₹{data?.due_amount || 0}
                  </h3>
                </div>

              </div>

              {/* ===== PAYMENT HISTORY ===== */}

              <div className="bg-white rounded-xl shadow p-4">

                <h3 className="text-lg font-semibold mb-4">
                  Payment History
                </h3>

                {data?.history?.length === 0 ? (

                  <p className="text-gray-500 text-center py-6">
                    No payments recorded
                  </p>

                ) : (

                  <table className="w-full">

                    <thead className="bg-gray-100 text-gray-600">
                      <tr>
                        <th className="p-3 text-left">Receipt No</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Amount</th>
                        <th className="p-3 text-left">Payment Method</th>
                        
                      </tr>
                    </thead>

                    <tbody>

                      {data?.history?.map((p) => (

                        <tr key={p._id} className="border-b hover:bg-gray-50">

                          <td className="p-3 font-semibold text-indigo-600">
                              {p.receipt_no || "-"}
                          </td>
                          <td className="p-3">
                            {formatDate(p.createdAt)}
                          </td>
                          <td className="p-3 text-green-600 font-semibold">
                            ₹{p.amount}
                          </td>

                         <td className="p-3">
                          {p.payment_mode || "-"}
                        </td>

                          

                        </tr>

                      ))}

                    </tbody>

                  </table>

                )}

              </div>
            </>
          )}

        </div>

      </div>

    </div>

  );

}