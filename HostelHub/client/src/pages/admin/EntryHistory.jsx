import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function EntryHistory() {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // ================= FORMAT DATE TIME =================
  const formatDateTime = (date) => {
    if (!date) return "N/A";

    const d = new Date(date);

    const formattedDate = d.toLocaleDateString("en-GB"); // dd/mm/yyyy
    const formattedTime = d.toLocaleTimeString();

    return `${formattedDate} || ${formattedTime}`;
  };

  // ================= FORMAT ONLY DATE =================
  const formatDateOnly = (date) => {
    if (!date) return "";

    const d = new Date(date);
    return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  // ================= FETCH =================
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/entries/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEntries(res.data);
        setFilteredEntries(res.data);
      } catch (error) {
        console.error("ENTRY HISTORY ERROR:", error);
      }
    };

    fetchEntries();
  }, []);

  // ================= FILTER =================
  const handleFilter = (value) => {
    setSelectedDate(value);

    if (!value) {
      setFilteredEntries(entries);
      return;
    }

    const filtered = entries.filter((e) => {
      const entryDate = formatDateOnly(e.time); // dd/mm/yyyy
      return entryDate === value;
    });

    setFilteredEntries(filtered);
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Entry History</h2>

      {/* 🔥 DATE FILTER (TEXT TYPE dd/mm/yyyy) */}
      <div className="bg-white p-4 rounded shadow mb-4 flex items-center gap-4">
        <label className="font-semibold">Filter by Date:</label>

        <input
          type="text"
          placeholder="dd/mm/yyyy"
          value={selectedDate}
          onChange={(e) => handleFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={() => {
            setSelectedDate("");
            setFilteredEntries(entries);
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Mobile</th>
              <th className="p-2 border">Room</th>
              <th className="p-2 border">Entry Type</th>
              <th className="p-2 border">Date & Time</th>
            </tr>
          </thead>

          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4">
                  No entries found
                </td>
              </tr>
            ) : (
              filteredEntries.map((e) => (
                <tr key={e._id}>
                  <td className="p-2 border">{e.name || "N/A"}</td>
                  <td className="p-2 border">{e.mobile || "N/A"}</td>
                  <td className="p-2 border">{e.room || "N/A"}</td>

                  <td className="p-2 border">
                    <span
                      className={`px-3 py-1 rounded text-white text-sm ${
                        e.entry_type === "IN"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {e.entry_type}
                    </span>
                  </td>

                  <td className="p-2 border">
                    {formatDateTime(e.time)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}