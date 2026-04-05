import { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  // SAFE USER PARSE
  const storedUser = localStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data");
    localStorage.removeItem("user");
  }

  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ FORMAT DATE (DD/MM/YYYY)
  const formatDateTime = (date) => {
    return date.toLocaleString("en-GB");
  };

  // 🔥 Get Full Name safely
  let fullName = "User";

if (user?.first_name && user?.last_name) {
  fullName = `${user.first_name} ${user.last_name}`;
} 
else if (user?.first_name) {
  fullName = user.first_name;
} 
else if (user?.name) {
  fullName = user.name;
} 
else if (user?.admin_name) {
  fullName = user.admin_name;
} 
else if (user?.username) {
  fullName = user.username;
}

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">

      {/* LEFT */}
      <div>
        <h2 className="text-lg font-semibold">
          Welcome, {fullName}
        </h2>

        <p className="text-sm text-gray-500">
          {formatDateTime(time)}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">

        {/* Avatar */}
        <div className="relative">

          <div
  onClick={() => setOpen(!open)}
  className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full cursor-pointer font-semibold"
>
  {`${user?.first_name?.charAt(0) || ""}${user?.last_name?.charAt(0) || ""}`
    .toUpperCase() || "U"}
</div>
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                <User size={16} /> Profile
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 w-full text-left text-red-500"
              >
                <LogOut size={16} /> Logout
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}  