import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function QRCard() {
  const [qr, setQr] = useState("");

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  console.log("USER DATA:", user); // 🔍 debug

  if (user && user.qr_code) {
    const fullUrl = `http://localhost:5000/${user.qr_code}`;
    console.log("QR URL:", fullUrl); // 🔍 debug

    setQr(fullUrl);
  }
}, []);

  return (
    <DashboardLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">

        <div className="bg-white p-6 shadow-xl rounded-xl text-center">

          <h2 className="text-xl font-semibold mb-4">My QR Code</h2>

          {qr ? (
            <img
              src={qr}
              alt="QR Code"
              className="w-48 h-48 object-contain mx-auto border p-2 rounded"
            />
          ) : (
            <p className="text-gray-500">QR Code not available</p>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
}