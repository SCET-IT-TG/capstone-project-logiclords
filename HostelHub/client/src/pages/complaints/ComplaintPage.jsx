import React, { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

const ComplaintPage = () => {

  const [complaints, setComplaints] = useState([]);
  const [text, setText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
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

  const submitComplaint = async () => {

    if (!text) return alert("Enter complaint");

    await axios.post(
      "http://localhost:5000/api/complaints",
      { complaint: text },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setText("");
    fetchComplaints();
  };

  const updateStatus = async (id, status) => {

    await axios.put(
      `http://localhost:5000/api/complaints/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    fetchComplaints();
  };

  return (

    <div className="flex">

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="p-6 bg-gray-100 min-h-screen">

          <h2 className="text-2xl font-bold mb-6">
            Complaint Management
          </h2>


          {(role === "student" || role === "warden") && (

            <div className="bg-white p-4 rounded shadow mb-6">

              <textarea
                className="w-full border p-2 mb-3"
                placeholder="Write complaint..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <button
                onClick={submitComplaint}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Submit Complaint
              </button>

            </div>

          )}


          <div className="bg-white p-4 rounded shadow">

            <table className="w-full border">

              <thead className="bg-gray-200">

                <tr>
                  <th className="border p-2">#</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Mobile</th>
                  <th className="border p-2">Complaint</th>
                  <th className="border p-2">Status</th>

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
                      : person?.name;

                  const id =
                    person?.student_id || person?.warden_id;

                  const mobile =
                    person?.mobile_number;

                  return (

                    <tr key={c._id} className="text-center">

                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{name}</td>
                      <td className="border p-2">{id}</td>
                      <td className="border p-2">{mobile}</td>
                      <td className="border p-2">{c.complaint}</td>

                      <td className="border p-2">

                        {c.status === "Pending" &&
                          <span className="bg-yellow-400 text-white px-2 py-1 rounded">
                            Pending
                          </span>}

                        {c.status === "Assigned" &&
                          <span className="bg-blue-500 text-white px-2 py-1 rounded">
                            Assigned
                          </span>}

                        {c.status === "Completed" &&
                          <span className="bg-green-500 text-white px-2 py-1 rounded">
                            Completed
                          </span>}

                      </td>


                      {(role === "admin" || role === "warden") && (

                        <td className="border p-2">

                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                            onClick={() => updateStatus(c._id, "Assigned")}
                          >
                            Assign
                          </button>

                          <button
                            className="bg-green-600 text-white px-2 py-1 rounded"
                            onClick={() => updateStatus(c._id, "Completed")}
                          >
                            Complete
                          </button>

                        </td>

                      )}

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

};

export default ComplaintPage;