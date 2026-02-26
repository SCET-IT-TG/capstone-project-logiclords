import { useEffect, useState } from "react";

const TopNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">

      <h1 className="text-lg font-semibold">
        Welcome, {user?.name}
      </h1>

      <div className="text-sm text-gray-600">
        {time}
      </div>

    </div>
  );
};

export default TopNavbar;