import { useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function CreateStudent() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/users/create",
        {
          name,
          email,
          role: "student"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // show created credentials
      setCreatedUser({
        name,
        email,
        password: `${name}123`
      });

      setName("");
      setEmail("");

    } catch (err) {
      alert(err.response?.data?.message || "Error creating student");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>

      <div className="max-w-xl mx-auto">

        <h2 className="text-3xl font-bold mb-6">
          Register Student
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4"
        >

          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="email"
            placeholder="Student Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition"
          >
            {loading ? "Creating..." : "Create Student"}
          </button>

        </form>

        {/* SUCCESS CARD */}
        {createdUser && (
          <div className="mt-6 bg-green-100 border border-green-300 p-4 rounded-lg">
            <h3 className="font-bold text-green-700 mb-2">
              ✅ Student Created Successfully
            </h3>

            <p><b>Name:</b> {createdUser.name}</p>
            <p><b>Email:</b> {createdUser.email}</p>
            <p><b>Password:</b> {createdUser.password}</p>
          </div>
        )}

      </div>

    </DashboardLayout>
  );
}