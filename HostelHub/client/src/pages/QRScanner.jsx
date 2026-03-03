import { useEffect } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner() {

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 5,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    const handleScan = async (decodedText) => {
      try {
        const token = localStorage.getItem("token");

        await axios.post(
          "http://localhost:5000/api/qr/scan",
          { userId: decodedText },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Entry Logged ✅");

      } catch (error) {
        console.error(error);
        alert("Scan Failed ❌");
      }
    };

    scanner.render(
      handleScan,
      (error) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Scan Student QR</h2>
      <div id="reader"></div>
    </div>
  );
}