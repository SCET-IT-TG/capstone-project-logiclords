import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Sun, Moon, User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const { dark, setDark } = useContext(ThemeContext);
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

  // 🔥 Get Full Name safely
  let fullName = "User";
  let firstName = "U";

  if (user?.first_name && user?.last_name) {
    fullName = `${user.first_name} ${user.last_name}`;
    firstName = user.first_name;
  } 
  else if (user?.first_name) {
    fullName = user.first_name;
    firstName = user.first_name;
  } 
  else if (user?.name) {
    fullName = user.name;
    firstName = user.name.split(" ")[0];
  } 
  else if (user?.admin_name) {
    fullName = user.admin_name;
    firstName = user.admin_name.split(" ")[0];
  } 
  else if (user?.username) {
    fullName = user.username;
    firstName = user.username;
  }

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white shadow px-6 py-4 flex justify-between items-center">

      {/* LEFT */}
      <div>
        <h2 className="text-lg font-semibold">
          Welcome, {fullName}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {time.toLocaleString()}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Avatar */}
        <div className="relative">

          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full cursor-pointer font-semibold"
          >
            {firstName.charAt(0).toUpperCase()}
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <User size={16} /> Profile
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/change-password");
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <Settings size={16} /> Change Password
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 dark:hover:bg-red-700 w-full text-left text-red-500"
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