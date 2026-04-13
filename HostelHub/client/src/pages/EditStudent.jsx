import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    student_mobile: "",
    parent_mobile: "",
    permanent_address: "",
    gender: "",
    room_id: "",
    date_of_birth: "",
  });

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await axios.get(
          `http://localhost:5000/api/students/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const roomRes = await axios.get(
          "http://localhost:5000/api/rooms",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStudent({
          ...studentRes.data,
          room_id: studentRes.data.room_id?._id || "",
        });

        setRooms(roomRes.data);

      } catch (error) {
        console.error(error);
        alert("Failed to load student data");
      }
    };

    fetchData();
  }, [id, token]);

  // ================= CHANGE =================
  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (!student.first_name || !student.email) {
      alert("First Name & Email required");
      return false;
    }
    return true;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await axios.put(
        `http://localhost:5000/api/students/${id}`,
        student,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Student updated successfully");
      navigate("/admin-dashboard");

    } catch (error) {
      console.error(error);
      alert("❌ Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow mt-6">

        <h2 className="text-2xl font-bold mb-6 text-center">
          ✏️ Edit Student
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          {/* NAME */}
          <input
            type="text"
            name="first_name"
            placeholder="First Name *"
            value={student.first_name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="middle_name"
            placeholder="Middle Name"
            value={student.middle_name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={student.last_name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={student.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* MOBILE */}
          <input
            type="text"
            name="student_mobile"
            placeholder="Student Mobile"
            value={student.student_mobile}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="parent_mobile"
            placeholder="Parent Mobile"
            value={student.parent_mobile}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* GENDER */}
          <select
            name="gender"
            value={student.gender}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* ROOM */}
          <select
            name="room_id"
            value={student.room_id}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Room</option>

            {rooms
              .filter(
                (r) =>
                  r.occupied_beds < r.capacity || r._id === student.room_id
              )
              .map((r) => (
                <option key={r._id} value={r._id}>
                  {r.block_no}-{r.room_no} ({r.room_type})
                </option>
              ))}
          </select>

          {/* DOB */}
          <input
            type="date"
            name="date_of_birth"
            value={student.date_of_birth?.substring(0, 10)}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* ADDRESS */}
          <textarea
            name="permanent_address"
            placeholder="Address"
            value={student.permanent_address}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded col-span-2 hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update Student"}
          </button>

        </form>
      </div>

    </DashboardLayout>
  );
}