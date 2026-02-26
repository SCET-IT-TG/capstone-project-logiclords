import { Link } from "react-router-dom";
const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="w-64 bg-indigo-700 text-white p-5 hidden md:block">

      {/* Logo */}
      <h2 className="text-2xl font-bold mb-8">🏨 Smart Hostel</h2>

      <div className="space-y-3">

        <Link to="/dashboard" className="block hover:bg-indigo-600 p-2 rounded">
          Dashboard
        </Link>

        {(user.role === "admin" || user.role === "warden") && (
          <Link to="/create-student" className="block hover:bg-indigo-600 p-2 rounded">
            Register Student
          </Link>
        )}

        {user.role === "admin" && (
          <Link to="/create-warden" className="block hover:bg-indigo-600 p-2 rounded">
            Register Warden
          </Link>
        )}

      </div>

    </div>
  );
};

export default Sidebar;