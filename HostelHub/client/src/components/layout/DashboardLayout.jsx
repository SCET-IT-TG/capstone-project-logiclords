import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }) {

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <Navbar />

        {/* ✅ FIXED: motion INSIDE return */}
        <motion.div
          className="p-6 overflow-y-auto flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>

      </div>

    </div>
  );
}