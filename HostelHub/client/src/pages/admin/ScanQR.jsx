import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function ScanQR() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const qrRef = useRef(null);
  const isRunningRef = useRef(false); // ✅ MAIN FIX

  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState("");
  const [lastScan, setLastScan] = useState("");
  const [scanned, setScanned] = useState(false);

  // ================= START CAMERA =================
  const startScanner = async () => {
    if (role !== "admin" && role !== "warden") {
      setMessage("⚠ Only admin or warden can scan QR");
      return;
    }

    if (isRunningRef.current) return;

    if (!qrRef.current) {
      qrRef.current = new Html5Qrcode("reader");
    }

    try {
      await qrRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },

        async (decodedText) => {
          if (scanned) return;

          setScanned(true);
          setLastScan(decodedText);

          try {
            const res = await axios.post(
              "http://localhost:5000/api/entries",
              { student_id: decodedText },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            setMessage(`✅ ${res.data.message}`);

            const audio = new Audio("/beep.mp3");
            audio.play().catch(() => {});

          } catch (err) {
            console.error(err);
            setMessage("❌ Scan Failed");
          }

          // ✅ SAFE STOP (NO ERROR)
          if (isRunningRef.current) {
            await stopScanner();
          }
        }
      );

      isRunningRef.current = true; // ✅ IMPORTANT
      setIsScanning(true);

    } catch (err) {
      console.error("Start Error:", err);
    }
  };

  // ================= STOP CAMERA =================
  const stopScanner = async () => {
    if (!qrRef.current) return;

    // ✅ MAIN FIX: prevent double stop
    if (!isRunningRef.current) return;

    try {
      await qrRef.current.stop();
      await qrRef.current.clear();
    } catch (err) {
      console.warn("Safe stop:", err.message);
    }

    isRunningRef.current = false;
    setIsScanning(false);
  };

  // ================= IMAGE SCAN =================
  const handleImageScan = async (e) => {
    if (role !== "admin" && role !== "warden") {
      setMessage("⚠ Only admin or warden can scan QR");
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    try {
      if (!qrRef.current) {
        qrRef.current = new Html5Qrcode("reader");
      }

      const decodedText = await qrRef.current.scanFile(file, true);

      setLastScan(decodedText);

      const res = await axios.post(
        "http://localhost:5000/api/entries",
        { student_id: decodedText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(`✅ ${res.data.message}`);

    } catch (err) {
      console.error(err);
      setMessage("❌ Image Scan Failed");
    }
  };

  // ================= RESET =================
  const resetScanner = () => {
    setScanned(false);
    setMessage("");
    setLastScan("");
  };

  // ================= CLEANUP =================
  useEffect(() => {
    return () => {
      if (qrRef.current && isRunningRef.current) {
        qrRef.current
          .stop()
          .then(() => qrRef.current.clear())
          .catch(() => {});
      }
    };
  }, []);

  return (
    <DashboardLayout>

      <h2 className="text-3xl font-bold text-center mb-6">
        Smart QR Scanner
      </h2>

      {/* ✅ ONLY ADMIN / WARDEN */}
      {(role === "admin" || role === "warden") ? (
        <>
          {/* SCANNER */}
          <div className="flex justify-center">
            <div className="bg-white shadow-xl rounded-xl p-4">
              <div id="reader" className="w-[300px] h-[300px]" />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-center gap-4 mt-6 flex-wrap">

            <button
              onClick={startScanner}
              disabled={isScanning}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded shadow disabled:bg-gray-400"
            >
              Start
            </button>

            <button
              onClick={stopScanner}
              disabled={!isScanning}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded shadow disabled:bg-gray-400"
            >
              Stop
            </button>

            <label className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded shadow cursor-pointer">
              Scan Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageScan}
                hidden
              />
            </label>

            <button
              onClick={resetScanner}
              className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded shadow"
            >
              Reset
            </button>

          </div>
        </>
      ) : (
        <p className="text-center text-red-500 font-semibold">
          ⚠ Scanner available only for Admin / Warden
        </p>
      )}

      {/* STATUS */}
      <div className="mt-6 text-center">
        <p className="font-semibold">Last Scan:</p>
        <p className="text-gray-600 break-all">{lastScan || "-"}</p>

        <p className="mt-2 text-lg font-bold text-green-600">
          {message}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {isScanning ? "📡 Camera Active" : "⏹ Camera Stopped"}
        </p>
      </div>

    </DashboardLayout>
  );
}