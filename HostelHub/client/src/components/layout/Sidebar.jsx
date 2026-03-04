import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  QrCode,
  Wrench,
  Settings,
  LogOut,
  DollarSign
} from "lucide-react";

import logo from "../../assets/logo.png";

export default function Sidebar() {

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data");
    localStorage.removeItem("user");
  }

  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;


  // ================= ROLE BASED MENU =================

  const menu = {

    admin: [

      {
        name: "Dashboard",
        path: "/admin-dashboard",
        icon: <LayoutDashboard size={18}/>
      },

      {
        name: "Register Student",
        path: "/create-student",
        icon: <Users size={18}/>
      },

      {
        name: "Register Warden",
        path: "/admin/create-warden",
        icon: <UserCog size={18}/>
      },

      {
        name: "Fee Management",
        path: "/admin-fees",
        icon: <DollarSign size={18}/>
      },

      {
        name: "Complaints",
        path: "/complaints",
        icon: <Wrench size={18}/>
      }

    ],


    warden: [

      {
        name: "Dashboard",
        path: "/warden-dashboard",
        icon: <LayoutDashboard size={18}/>
      },

      {
        name: "QR Scanner",
        path: "/scan",
        icon: <QrCode size={18}/>
      },

      {
        name: "Complaints",
        path: "/complaints",
        icon: <Wrench size={18}/>
      }

    ],


    student: [

      {
        name: "Dashboard",
        path: "/student-dashboard",
        icon: <LayoutDashboard size={18}/>
      },

      {
        name: "My Fees",
        path: "/student-fee",
        icon: <DollarSign size={18}/>
      },

      {
        name: "Complaints",
        path: "/complaints",
        icon: <Wrench size={18}/>
      },

      {
        name: "My QR Code",
        path: "/qr",
        icon: <QrCode size={18}/>
      }

    ]

  };


  // ================= LOGOUT =================

  const logout = () => {

    localStorage.clear();
    navigate("/login");

  };


  return (

    <div className="w-64 min-h-screen bg-indigo-600 text-white flex flex-col p-5">

      {/* LOGO */}
      <div className="flex justify-center mb-8">

        <img
          src={logo}
          alt="HostelHub Logo"
          className="w-80 h-30 object-contain transition-transform hover:scale-105"
        />

      </div>


      {/* MENU */}
      <div className="flex-1 space-y-2">

        {menu[user.role]?.map((item) => (

          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
            ${
              location.pathname === item.path
                ? "bg-white text-indigo-600 shadow-md"
                : "hover:bg-indigo-500"
            }`}
          >

            {item.icon}

            <span>{item.name}</span>

          </Link>

        ))}

      </div>


      {/* BOTTOM */}
      <div className="border-t border-indigo-400 pt-4 space-y-2">

        <Link
          to="/settings"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-500 transition"
        >
          <Settings size={18}/>
          Settings
        </Link>


        <button
          onClick={logout}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500 transition w-full text-left"
        >
          <LogOut size={18}/>
          Logout
        </button>

      </div>

    </div>

  );

}