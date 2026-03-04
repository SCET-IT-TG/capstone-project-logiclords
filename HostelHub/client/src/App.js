import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import QRScanner from "./pages/QRScanner";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import WardenDashboard from "./pages/dashboard/WardenDashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import CreateStudent from "./components/forms/StudentForm";
import WardenForm from "./components/forms/WardenForm";
// 🔐 Protected Route with Role Support
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If role restriction exists
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
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

        {/* Warden Routes */}
        <Route
          path="/warden-dashboard"
          element={
            <ProtectedRoute allowedRoles={["warden"]}>
              <WardenDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/create-warden" element={<WardenForm />} />

        {/* QR Scanner */}
        <Route
          path="/scan"
          element={
            <ProtectedRoute allowedRoles={["admin", "warden"]}>
              <QRScanner />
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;