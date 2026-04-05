import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        console.error("User or token missing");
        return;
      }

      let url = "";

      if (user.role === "student") {
        url = `http://localhost:5000/api/students/${user.id}`;
      } else if (user.role === "warden") {
        url = `http://localhost:5000/api/wardens/${user.id}`;
      } else if (user.role === "admin") {
        url = `http://localhost:5000/api/admins/${user.id}`;
      }

      if (!url) {
        console.error("Invalid role");
        return;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(res.data);
      console.log("PHOTO:", res.data.profile_photo);
    } catch (err) {
      console.error("Profile fetch error:", err.response?.data || err.message);
    }
  };

  fetchProfile();
}, []);

  if (!userData) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 flex justify-center">
        <div className="bg-white shadow-xl rounded-xl p-6 w-[420px]">

          <h2 className="text-xl font-bold mb-4 text-center">
            My Profile
          </h2>

          {/* PROFILE PHOTO */}
          <div className="flex justify-center mb-4">
  <div className="w-24 h-24 bg-indigo-600 text-white flex items-center justify-center rounded-full text-3xl font-bold shadow">
    {`${userData.first_name?.charAt(0) || ""}${userData.last_name?.charAt(0) || ""}`.toUpperCase() || "U"}
  </div>
</div>

          {/* COMMON */}
          <p><b>Name:</b> {userData.first_name} {userData.middle_name} {userData.last_name}</p>
          <p><b>Email:</b> {userData.email}</p>

          {/* ================= STUDENT ================= */}
          {userData.role === "student" && (
            <>
              <p><b>Mobile:</b> {userData.student_mobile}</p>
              <p><b>Gender:</b> {userData.gender}</p>
              <p>
                <b>Room No:</b>{" "}
                {userData.room_no || userData.room_id?.room_no || "Not Assigned"}
              </p>
              <p>
                <b>Admission Date:</b>{" "}
                {userData.admission_date
                  ? new Date(userData.admission_date).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>

              <p><b>Fee Status:</b> {userData.fee_status}</p>
              <p><b>Total Fee:</b> ₹{userData.total_fee}</p>
              <p><b>Paid:</b> ₹{userData.paid_amount}</p>

              {/* QR CODE */}
              {userData.qr_code && (
                <div className="mt-4 text-center">
                  <img
                    src={`http://localhost:5000/${userData.qr_code}`}
                    alt="QR"
                    className="w-32 mx-auto"
                  />
                </div>
              )}
            </>
          )}

          {/* ================= WARDEN ================= */}
          {userData.warden_id && (
            <>
              <p><b>Warden ID:</b> {userData.warden_id}</p>
              <p><b>Block:</b> {userData.assigned_block}</p>
              <p><b>DOB:</b> {userData.date_of_birth?.slice(0,10)}</p>
            </>
          )}

          {/* ================= ADMIN ================= */}
          {userData.admin_id && (
            <>
              <p><b>Admin ID:</b> {userData.admin_id}</p>
            </>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}