import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function FeeManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");  
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [totalFeeInput, setTotalFeeInput] = useState("");

  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("Cash");

  const [history, setHistory] = useState([]);

  const [showPayModal, setShowPayModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const token = localStorage.getItem("token");
  const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB");
};
  const user = JSON.parse(localStorage.getItem("user"));

  // ================= FETCH =================
  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/fees/admin",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []); // eslint-disable-line

  // ================= SELECT =================
  const handleSelect = (student) => {
    setSelectedStudent(student);
    setEditMode(false);
    setTotalFeeInput(student.total_fee);
  };

  // ================= UPDATE =================
  const updateTotalFee = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/fees/update/${selectedStudent._id}`,
        { total_fee: Number(totalFeeInput) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Updated ✅");
      setEditMode(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= PAY =================
  const handlePayment = async () => {
    try {
      if (!amount) return alert("Enter amount");

      await axios.post(
        `http://localhost:5000/api/fees/pay/${selectedStudent._id}`,
        { amount: Number(amount), payment_mode: mode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment Successful ✅");

      setAmount("");
      setShowPayModal(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Payment Failed ❌");
    }
  };

  // ================= HISTORY =================
  const openHistory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/fees/history/${selectedStudent._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(res.data);
      setShowHistoryModal(true);
    } catch (err) {
      console.error(err);
    }
  };
  const filteredStudents = students.filter((s) => {
  const name = `${s.first_name} ${s.last_name}`.toLowerCase();

  const matchName = name.includes(search.toLowerCase());

  const matchStatus =
    statusFilter === "all" || s.fee_status === statusFilter;

  return matchName && matchStatus;
});

  // ================= TOTAL =================
  const totalFees = students.reduce((s, x) => s + (x.total_fee || 0), 0);
  const totalPaid = students.reduce((s, x) => s + (x.paid_amount || 0), 0);
  const totalDue = students.reduce((s, x) => s + (x.due_amount || 0), 0);

  if (user?.role !== "admin") return <div>Access Denied</div>;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 bg-gray-100 min-h-screen">

          <h2 className="text-2xl font-bold mb-6">Fee Management</h2>
        <div className="flex gap-3 mb-4">
  <input
    type="text"
    placeholder="Search by name..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="p-2 border rounded w-64"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="p-2 border rounded"
  >
    <option value="all">All</option>
    <option value="paid">Paid</option>
    <option value="partial">Partial</option>
    <option value="pending">Pending</option>
  </select>
</div>
          {/* ✅ DASHBOARD */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">Total Fees</p>
              <h3 className="text-2xl font-bold text-indigo-600">
                ₹{totalFees}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">Collected</p>
              <h3 className="text-2xl font-bold text-green-600">
                ₹{totalPaid}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold text-red-500">
                ₹{totalDue}
              </h3>
            </div>
          </div>

          {/* LOADING */}
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid grid-cols-4 gap-6">

              {/* TABLE */}
              <div className="col-span-3 bg-white rounded-xl shadow">
                <table className="w-full text-center border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">ID</th>
                      <th className="border p-2">Name</th>
                      <th className="border p-2 w-32">Total</th>
                      <th className="border p-2">Paid</th>
                      <th className="border p-2">Due</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.map((s) => (
                      <tr
                        key={s._id}
                        onClick={() => handleSelect(s)}
                        className={`cursor-pointer border ${
                          selectedStudent?._id === s._id
                            ? "bg-blue-100"
                            : ""
                        }`}
                      >
                        <td className="border p-2">{s.student_id}</td>
                        <td className="border p-2">
                          {s.first_name} {s.last_name}
                        </td>

                        <td className="border p-2">
                          <div className="w-full h-8 flex items-center justify-center">
  {editMode && selectedStudent?._id === s._id ? (
    <input
      value={totalFeeInput}
      onChange={(e) => setTotalFeeInput(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className="border w-full h-full text-center"
    />
  ) : (
    <span>₹{s.total_fee}</span>
  )}
</div>
                        </td>

                        <td className="border p-2 text-green-600">
                          ₹{s.paid_amount}
                        </td>
                        <td className="border p-2 text-red-500">
                          ₹{s.due_amount}
                        </td>

                        <td className="border p-2">{s.fee_status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* RIGHT PANEL */}
              <div className="bg-white p-4 rounded-xl shadow space-y-3">
                {!selectedStudent ? (
                  <p>Select Student</p>
                ) : (
                  <>
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="w-full bg-blue-500 text-white p-2 rounded"
                      >
                        Edit Fee
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={updateTotalFee}
                          className="w-full bg-green-500 text-white p-2 rounded"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setEditMode(false)}
                          className="w-full bg-gray-400 text-white p-2 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {selectedStudent.fee_status !== "paid" && (
  <button
    onClick={() => setShowPayModal(true)}
    className="w-full bg-indigo-500 text-white p-2 rounded"
  >
    Pay
  </button>
)}

                    <button
                      onClick={openHistory}
                      className="w-full bg-yellow-500 text-white p-2 rounded"
                    >
                      History
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PAY MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="font-bold mb-3">Make Payment</h3>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border w-full p-2 mb-3"
            />

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border w-full p-2 mb-3"
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Paytm</option>
            </select>

            <button
              onClick={handlePayment}
              className="bg-green-500 text-white w-full p-2 rounded"
            >
              Pay
            </button>

            <button
              onClick={() => setShowPayModal(false)}
              className="mt-2 bg-gray-400 text-white w-full p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[500px]">

            <h3 className="font-bold mb-3">Payment History</h3>

            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Receipt</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Mode</th>
                </tr>
              </thead>

              <tbody>
                {history.map((h) => (
                  <tr key={h._id}>
                    <td className="border p-2">{h.receipt_no}</td>
                    <td className="border p-2">{formatDate(h.createdAt)}</td>
                    <td className="border p-2">₹{h.amount}</td>
                    <td className="border p-2">{h.payment_mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => setShowHistoryModal(false)}
              className="mt-3 bg-gray-400 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}