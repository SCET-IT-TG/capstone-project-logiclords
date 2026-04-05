import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function StudentDashboard() {
  const [data, setData] = useState({
    student: {},
    complaints: [],
    visitors: [],
  });

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) return;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let studentRes;
      let complaintRes = { data: [] };
      let visitorRes = { data: [] };

      // ✅ STUDENT (must work)
      studentRes = await axios.get(
        `http://localhost:5000/api/students/${user.id}`,
        { headers }
      );

      // ✅ TRY COMPLAINTS (avoid crash)
      try {
        complaintRes = await axios.get(
          `http://localhost:5000/api/complaints`,
          { headers }
        );
      } catch (e) {
        console.warn("Complaint API not ready");
      }

      // ✅ TRY VISITORS
      try {
        visitorRes = await axios.get(
          `http://localhost:5000/api/visitors`,
          { headers }
        );
      } catch (e) {
        console.warn("Visitor API not ready");
      }

      setData({
        student: studentRes.data.student || studentRes.data,
        complaints: complaintRes.data || [],
        visitors: visitorRes.data || [],
      });

    } catch (err) {
      console.error("Dashboard error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

  if (loading) {
    return <p className="text-center mt-10">Loading Dashboard...</p>;
  }

  return (
    <DashboardLayout>
      <div className="p-6">

        <h2 className="text-2xl font-bold mb-6">
          Student Dashboard
        </h2>

        {/* 🔥 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* STUDENT ID */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-gray-500">Student ID</h3>
            <p className="text-xl font-bold mt-2">
              {data.student.student_id}
            </p>
          </div>

          {/* FEE STATUS */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-gray-500">Fee Status</h3>
            <p
              className={`text-xl font-bold mt-2 ${
                data.student.fee_status === "paid"
                  ? "text-green-600"
                  : data.student.fee_status === "partial"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {data.student.fee_status}
            </p>
          </div>

          {/* COMPLAINT COUNT */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-gray-500">My Complaints</h3>
            <p className="text-xl font-bold mt-2">
              {data.complaints.length}
            </p>
          </div>

          {/* VISITOR COUNT */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-gray-500">My Visitors</h3>
            <p className="text-xl font-bold mt-2">
              {data.visitors.length}
            </p>
          </div>

        </div>

        {/* 🔥 DETAILS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* RECENT COMPLAINTS */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="font-bold mb-3">Recent Complaints</h3>

            {data.complaints.length === 0 ? (
              <p>No complaints</p>
            ) : (
              [...data.complaints]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 2)
  .map((c) => (
                <div key={c._id} className="border-b py-2">
                  <p className="font-semibold">{c.complaint_no}</p>
                  <p className="text-sm text-gray-500">{c.status}</p>
                </div>
              ))
            )}
          </div>

          {/* VISITOR STATUS */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="font-bold mb-3">Visitor Requests</h3>

            {data.visitors.length === 0 ? (
              <p>No visitors</p>
            ) : (
              [...data.visitors]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 2)
  .map((v) => (
                <div key={v._id} className="border-b py-2">
                  <p className="font-semibold">{v.visitor_name}</p>
                  <p className="text-sm text-gray-500">{v.status}</p>
                </div>
              ))
            )}
          </div>

        </div>

        {/* 🔥 QR CODE */}
        {data.student.qr_code && (
          <div className="mt-8 bg-white shadow-md rounded-xl p-6 text-center">
            <h3 className="font-bold mb-4">My QR Code</h3>

            <img
              src={`http://localhost:5000/${data.student.qr_code}`}
              alt="QR"
              className="w-40 mx-auto"
            />
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}