import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function AddRoom() {
  const [form, setForm] = useState({
    block_no: "",
    room_no: "",
    capacity: "",
    room_type: "",
    rent_per_month: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/rooms",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ CORRECT NAVIGATION (FIXED)
      navigate("/admin-dashboard", { replace: true });

    } catch (error) {
      console.error("ADD ROOM ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add room");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Add Room</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* BLOCK */}
          <input
            type="text"
            name="block_no"
            placeholder="Block No (A/B/C)"
            className="w-full border p-2 rounded"
            value={form.block_no}
            onChange={handleChange}
            required
          />

          {/* ROOM NO */}
          <input
            type="text"
            name="room_no"
            placeholder="Room Number (101, 102)"
            className="w-full border p-2 rounded"
            value={form.room_no}
            onChange={handleChange}
            required
          />

          {/* CAPACITY */}
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            className="w-full border p-2 rounded"
            value={form.capacity}
            onChange={handleChange}
            required
          />

          {/* ROOM TYPE */}
          <select
            name="room_type"
            className="w-full border p-2 rounded"
            value={form.room_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Room Type</option>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
          </select>

          {/* RENT */}
          <input
            type="number"
            name="rent_per_month"
            placeholder="Rent per month"
            className="w-full border p-2 rounded"
            value={form.rent_per_month}
            onChange={handleChange}
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
          >
            Add Room
          </button>

        </form>
      </div>
    </DashboardLayout>
  );
}