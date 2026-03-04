import { useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function CreateStudent() {

  const [formData, setFormData] = useState({
    enrollment_no: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    gender: "",
    date_of_birth: "",
    admission_date: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/students",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(
`Student Created Successfully

Student ID: ${res.data.student_id}
Enrollment No: ${res.data.enrollment_no}
Password: ${res.data.generated_password}`
      );

      setFormData({
        enrollment_no: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        mobile_number: "",
        gender: "",
        date_of_birth: "",
        admission_date: ""
      });

    } catch (error) {
      alert(error.response?.data?.message || "Error creating student");
    } finally {
      setLoading(false);
    }
  };

  return (

    <DashboardLayout>

      <div className="flex justify-center">

        <div className="bg-white shadow-xl rounded-xl p-8 w-[500px]">

          <h2 className="text-2xl font-bold mb-4 text-center">
            Register Student
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">

            <input
              type="text"
              name="enrollment_no"
              placeholder="Enrollment Number"
              value={formData.enrollment_no}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />

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
              required
              className="w-full border p-2 rounded"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="mobile_number"
              placeholder="Mobile Number"
              value={formData.mobile_number}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            {/* Date of Birth */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
            </div>

            {/* Admission Date */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Admission Date
              </label>
              <input
                type="date"
                name="admission_date"
                value={formData.admission_date}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
            </div>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              {loading ? "Creating..." : "Register Student"}
            </button>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
}