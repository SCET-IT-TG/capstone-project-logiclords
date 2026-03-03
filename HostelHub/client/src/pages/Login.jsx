import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.png";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerErrorAnimation = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email && !password) {
      alert("❌ Email and Password both incorrect");
      triggerErrorAnimation();
      return;
    }

    if (!email) {
      alert("❌ Email incorrect");
      triggerErrorAnimation();
      return;
    }

    if (!password) {
      alert("❌ Password incorrect");
      triggerErrorAnimation();
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true } // 🔥 important
      );

      const user = res.data; // backend returns user directly

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "warden") {
        navigate("/warden-dashboard");
      } else {
        navigate("/student-dashboard");
      }

    } catch (err) {
      alert(
        err?.response?.data?.message || 
        "Invalid Email Id or Password"
      );
      triggerErrorAnimation();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500">

      <div
        className={`backdrop-blur-lg bg-white/90 shadow-2xl
        rounded-2xl p-8 w-[380px] transition-all duration-300
        ${shake ? "animate-shake" : ""}`}
      >

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="HostelHub Logo"
            className="w-200 h-100 object-contain mb-2"
          />
          <h2 className="text-2xl font-bold text-gray-800">
            Login
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            className="w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-indigo-500
            focus:outline-none transition"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              className="w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-indigo-500
              focus:outline-none transition"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700
            text-white py-3 rounded-lg font-semibold
            transition duration-300 shadow-md active:scale-95"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}