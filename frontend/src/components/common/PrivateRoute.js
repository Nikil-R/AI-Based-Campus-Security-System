import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (!token || !user) return <Navigate to="/login" replace />;

  // If route has role restrictions
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on actual user role
    return user.role === "admin"
      ? <Navigate to="/admin/home" replace />
      : <Navigate to="/user/home" replace />;
  }

  return children;
};

export default PrivateRoute;
