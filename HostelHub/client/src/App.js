import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import QRScanner from "./pages/QRScanner";

// Dashboards
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import WardenDashboard from "./pages/dashboard/WardenDashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";

// Forms
import CreateStudent from "./components/forms/StudentForm";
import WardenForm from "./components/forms/WardenForm";

// Complaints
import ComplaintPage from "./pages/complaints/ComplaintPage";

// Fee Pages
import FeeManagement from "./pages/FeeManagement";
import FeeStatus from "./pages/FeeStatus";


// 🔐 Protected Route with Role Support
const ProtectedRoute = ({ children, allowedRoles }) => {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================= LOGIN ================= */}

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />


        {/* ================= ADMIN ================= */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-student"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-warden"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <WardenForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-fees"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FeeManagement />
            </ProtectedRoute>
          }
        />


        {/* ================= WARDEN ================= */}

        <Route
          path="/warden-dashboard"
          element={
            <ProtectedRoute allowedRoles={["warden"]}>
              <WardenDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/warden-complaints"
          element={
            <ProtectedRoute allowedRoles={["warden"]}>
              <ComplaintPage />
            </ProtectedRoute>
          }
        />


        {/* ================= STUDENT ================= */}

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-fee"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <FeeStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-complaints"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ComplaintPage />
            </ProtectedRoute>
          }
        />


        {/* ================= QR SCANNER ================= */}

        <Route
          path="/scan"
          element={
            <ProtectedRoute allowedRoles={["admin", "warden"]}>
              <QRScanner />
            </ProtectedRoute>
          }
        />


        {/* ================= COMMON COMPLAINT PAGE ================= */}

        <Route
          path="/complaints"
          element={
            <ProtectedRoute allowedRoles={["admin", "warden", "student"]}>
              <ComplaintPage />
            </ProtectedRoute>
          }
        />


        {/* ================= 404 ================= */}

        <Route path="*" element={<h2>404 - Page Not Found</h2>} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;