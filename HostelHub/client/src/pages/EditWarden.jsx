import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function EditWarden() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [warden, setWarden] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    assigned_block: "",
    date_of_birth: "",
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ BLOCK OPTIONS (you can expand)
  const blocks = ["A", "B", "C", "D"];

  // ================= FETCH =================
  useEffect(() => {
    const fetchWarden = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/wardens/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setWarden(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load warden");
      }
    };

    fetchWarden();
  }, [id, token]);

  // ================= CHANGE =================
  const handleChange = (e) => {
    setWarden({
      ...warden,
      [e.target.name]: e.target.value,
    });
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (!warden.first_name || !warden.last_name || !warden.email) {
      alert("Please fill required fields");
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
        `http://localhost:5000/api/wardens/${id}`,
        warden,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Warden updated successfully");
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

      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-6">

        <h2 className="text-2xl font-bold mb-6 text-center">
          ✏️ Edit Warden
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">

          {/* FIRST NAME */}
          <input
            type="text"
            name="first_name"
            placeholder="First Name *"
            value={warden.first_name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* MIDDLE */}
          <input
            type="text"
            name="middle_name"
            placeholder="Middle Name"
            value={warden.middle_name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* LAST */}
          <input
            type="text"
            name="last_name"
            placeholder="Last Name *"
            value={warden.last_name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={warden.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* BLOCK DROPDOWN */}
          <select
            name="assigned_block"
            value={warden.assigned_block}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Block</option>
            {blocks.map((b) => (
              <option key={b} value={b}>
                Block {b}
              </option>
            ))}
          </select>

          {/* DOB */}
          <input
            type="date"
            name="date_of_birth"
            value={warden.date_of_birth?.substring(0, 10)}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update Warden"}
          </button>

        </form>
      </div>

    </DashboardLayout>
  );
}