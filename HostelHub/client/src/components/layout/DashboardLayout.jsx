import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
export default function DashboardLayout({ children }) {
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  {/* dashboard content */}
</motion.div>
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>

    </div>
  );
}