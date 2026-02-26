import { useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

const CreateStudent = () => {

  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/users/create",
      { name, role: "student" },
      { withCredentials: true }
    );

    alert("Student Created");
  };

  return (
    <MainLayout>

      <h2 className="text-2xl font-bold mb-4">Register Student</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">

        <input
          type="text"
          placeholder="Student Name"
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded">
          Create
        </button>

      </form>

    </MainLayout>
  );
};

export default CreateStudent;