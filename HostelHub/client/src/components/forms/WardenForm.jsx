import { useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function CreateWarden() {

  const token = localStorage.getItem("token");

  const [generatedData, setGeneratedData] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    assigned_block: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/wardens/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ SAVE DATA (FIX WARNING)
      setGeneratedData({
        warden_id: res.data.warden_id,
        generated_password: res.data.generated_password,
      });

      // Optional alert
      alert("Warden Created Successfully");

      setFormData({
        first_name: "",
        middle_name: "",
        last_name: "",
        date_of_birth: "",
        assigned_block: "",
        email: "",
      });

    } catch (error) {
      alert(error.response?.data?.message || "Error creating warden");
    }
  };

  return (
    <DashboardLayout>

      <div className="flex justify-center">

        <div className="bg-white shadow-xl rounded-xl p-8 w-[500px]">

          <h2 className="text-2xl font-bold mb-4 text-center">
            Register Warden
          </h2>

          {/* ✅ SHOW GENERATED DATA */}
          {generatedData && (
            <div className="bg-green-100 p-4 rounded mb-4 text-sm">
              <p><strong>Warden ID:</strong> {generatedData.warden_id}</p>
              <p><strong>Password:</strong> {generatedData.generated_password}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">

            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="middle_name"
              placeholder="Middle Name"
              value={formData.middle_name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="assigned_block"
              placeholder="Assigned Block"
              value={formData.assigned_block}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <button className="w-full bg-indigo-600 text-white py-2 rounded">
              Register Warden
            </button>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
}