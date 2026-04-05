import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function EditRoom() {

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [room, setRoom] = useState({
    block_no: "",
    room_no: "",
    room_type: "Non-AC",
    capacity: "",
    occupied_beds: 0,
    rent_per_month: "",
  });

  const [loading, setLoading] = useState(true);

  // ================= FETCH ROOM =================
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/rooms/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setRoom(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch Room Error:", error);
        alert("Failed to load room");
      }
    };

    fetchRoom();
  }, [id, token]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setRoom((prev) => ({
      ...prev,
      [name]:
        name === "capacity" ||
        name === "occupied_beds" ||
        name === "rent_per_month"
          ? Number(value)
          : value,
    }));
  };

  // ================= UPDATE ROOM =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/rooms/${id}`,
        room,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Room updated successfully");

      // ✅ SAME AS ADD ROOM
      const user = JSON.parse(localStorage.getItem("user"));

        if (user?.role === "admin") {
          navigate("/admin-dashboard", { replace: true });
        } else {
          navigate("/warden-dashboard", { replace: true });
        }

    } catch (error) {
      console.error("Update Error:", error);
      alert("Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto bg-white shadow p-6 rounded">

        <h2 className="text-2xl font-bold mb-4">Edit Room</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Block */}
          <div>
            <label className="block font-medium">Block No</label>
            <input
              type="text"
              name="block_no"
              value={room.block_no}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Room No */}
          <div>
            <label className="block font-medium">Room No</label>
            <input
              type="text"
              name="room_no"
              value={room.room_no}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Room Type */}
          <div>
            <label className="block font-medium">Room Type</label>
            <select
              name="room_type"
              value={room.room_type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>
          </div>

          {/* Capacity */}
          <div>
            <label className="block font-medium">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={room.capacity}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Occupied */}
          <div>
            <label className="block font-medium">Occupied Beds</label>
            <input
              type="number"
              name="occupied_beds"
              value={room.occupied_beds}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Rent */}
          <div>
            <label className="block font-medium">Rent Per Month</label>
            <input
              type="number"
              name="rent_per_month"
              value={room.rent_per_month}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update Room
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin-dashboard")}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}