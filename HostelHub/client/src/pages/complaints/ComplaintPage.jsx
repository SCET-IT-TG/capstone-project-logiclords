import React, { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

const ComplaintPage = () => {

  const [complaints, setComplaints] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState({});

  const [selectedImage, setSelectedImage] = useState(null); // 🔥 MODAL

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const role = user?.role;

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setComplaints(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ================= SUBMIT =================
  const submitComplaint = async () => {

    if (!text) return alert("Enter complaint");

    try {
      const formData = new FormData();
      formData.append("complaint", text);

      // ✅ OPTIONAL PHOTO
      if (file) formData.append("photo", file);

      await axios.post(
        "http://localhost:5000/api/complaints",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setText("");
      setFile(null);
      fetchComplaints();

    } catch (err) {
      console.log(err);
    }
  };

  // ================= STATUS =================
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}`,
        { status, remark: remarks[id] },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchComplaints();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <div className="p-6 bg-gray-100 min-h-screen">

          <h2 className="text-2xl font-bold mb-6">
            Complaint Management
          </h2>

          {/* ================= STUDENT FORM ================= */}
          {(role === "student" || role === "warden") && (
            <div className="bg-white p-4 rounded shadow mb-6">

              <textarea
                className="w-full border p-2 mb-3"
                placeholder="Write complaint..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <input
                type="file"
                className="mb-3"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button
                onClick={submitComplaint}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Submit Complaint
              </button>

            </div>
          )}

          {/* ================= TABLE ================= */}
          <div className="bg-white p-4 rounded shadow">

            <table className="w-full border text-sm">

              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Complaint No</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Mobile</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Photo</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Remark</th>

                  {(role === "admin" || role === "warden") &&
                    <th className="border p-2">Action</th>}
                </tr>
              </thead>

              <tbody>

                {complaints.map((c, index) => {

                  const person = c.created_by;

                  const name =
                    person?.first_name
                      ? `${person.first_name} ${person.last_name}`
                      : "Unknown";

                  const mobile =
                            person?.student_mobile ||
                            person?.mobile_number ||
                            "-";

                  return (
                    <tr key={c._id} className="text-center">

                      <td className="border p-2">CMP-{index + 1}</td>
                      <td className="border p-2">{name}</td>
                      <td className="border p-2">{mobile}</td>
                      <td className="border p-2">{c.complaint}</td>

                      {/* 🔥 VIEW BUTTON */}
                      <td className="border p-2">
                        {c.photo ? (
                          <button
                            onClick={() =>
                              setSelectedImage(`http://localhost:5000/${c.photo}`)
                            }
                            className="bg-indigo-500 text-white px-2 py-1 rounded"
                          >
                            View
                          </button>
                        ) : "-"}
                      </td>

                      {/* STATUS */}
                      <td className="border p-2">
                        <span className={`px-2 py-1 text-white rounded ${
                          c.status === "Pending"
                            ? "bg-yellow-400"
                            : c.status === "Assigned"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}>
                          {c.status}
                        </span>
                      </td>

                      <td className="border p-2">{c.remark || "-"}</td>

                      {(role === "admin" || role === "warden") && (
  <td className="border p-2 text-center">

    {c.status !== "Completed" && (
      <>
        <input
          type="text"
          placeholder="Remark"
          className="border p-1 mb-2"
          value={remarks[c._id] || ""}
          onChange={(e) =>
            setRemarks({
              ...remarks,
              [c._id]: e.target.value
            })
          }
        />

        <div className="flex gap-2 justify-center">
          {c.status === "Pending" && (
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => updateStatus(c._id, "Assigned")}
            >
              Assign
            </button>
          )}

          <button
            className="bg-green-600 text-white px-2 py-1 rounded"
            onClick={() => updateStatus(c._id, "Completed")}
          >
            Complete
          </button>
        </div>
      </>
    )}

  </td>
)}

                    </tr>
                  );

                })}

              </tbody>

            </table>

          </div>

          {/* ================= IMAGE MODAL ================= */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">

              <div className="bg-white p-4 rounded shadow-lg relative">

                <button
                  className="absolute top-2 right-2 text-red-500"
                  onClick={() => setSelectedImage(null)}
                >
                  ✖
                </button>

                <img
                  src={selectedImage}
                  alt="Complaint"
                  className="max-w-[500px] max-h-[500px]"
                />

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ComplaintPage;