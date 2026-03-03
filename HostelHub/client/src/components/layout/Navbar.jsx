import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function Navbar() {

  const { dark, setDark } = useContext(ThemeContext);
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-white dark:bg-gray-900
                    dark:text-white shadow px-6 py-4 flex justify-between">

      <h2>Welcome, {user.name}</h2>

      <div className="flex gap-3">

        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
        >
          {dark ? "☀️" : "🌙"}
        </button>

      </div>
    </div>
  );
}