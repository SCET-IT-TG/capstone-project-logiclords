import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {

  const storedUser = localStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data in localStorage");
    localStorage.removeItem("user");
  }

  // Not logged in
  if (!user) return <Navigate to="/login" />;

  // Role check
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;