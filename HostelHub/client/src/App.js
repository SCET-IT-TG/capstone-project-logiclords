import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
//import QRScanner from "./pages/QRScanner";

// ✅ FIXED IMPORT PATH
import QRCard from "./pages/QRCard";

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

// Visitor Pages
import VisitorPage from "./pages/visitors/VisitorPage";
import StudentVisitors from "./pages/visitors/StudentVisitors";

import Profile from "./pages/Profile";

//editwarden
import EditWarden from "./pages/EditWarden";

//editstudent
import EditStudent from "./pages/EditStudent";

//addroom
import AddRoom from "./pages/admin/AddRoom";

import EditRoom from "./pages/admin/EditRoom";

import ScanQR from "./pages/admin/ScanQR";

import EntryHistory from "./pages/admin/EntryHistory";


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

        <Route
          path="/visitors"
          element={
            <ProtectedRoute allowedRoles={["admin","warden"]}>
              <VisitorPage />
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

        <Route
          path="/student-visitors"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentVisitors />
            </ProtectedRoute>
          }
        />

        {/* ✅ QR PAGE ROUTE */}
        <Route
          path="/student/qr"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <QRCard />
            </ProtectedRoute>
          }
        />


        {/* ================= QR SCANNER ================= */}

        {/*<Route
          path="/scan"
          element={
            <ProtectedRoute allowedRoles={["admin", "warden"]}>
              <QRScanner />
            </ProtectedRoute>
          }
        />*}


        {/* ================= COMMON COMPLAINT PAGE ================= */}

        <Route
          path="/complaints"
          element={
            <ProtectedRoute allowedRoles={["admin", "warden", "student"]}>
              <ComplaintPage />
            </ProtectedRoute>
          }
        />
        {/*editwarden*/}
      <Route path="/edit-warden/:id" element={<EditWarden />} />
      
       {/*editstudent*/}
      <Route path="/edit-student/:id" element={<EditStudent />} />

            <Route path="/add-room" element={<AddRoom />} />
            <Route path="/edit-room/:id" element={<EditRoom />} />
            <Route path="/scan-qr" element={<ScanQR />} />
            <Route
              path="/entry-history"
              element={
                <ProtectedRoute allowedRoles={["admin", "warden"]}>
                  <EntryHistory />
                </ProtectedRoute>
              }
            />
        {/* ================= 404 ================= */}

        <Route path="*" element={<h2>404 - Page Not Found</h2>} />

          <Route path="/profile" element={<Profile />} />
      </Routes>

    </BrowserRouter>

  );

}

export default App;