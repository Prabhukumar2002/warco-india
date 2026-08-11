import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checking } = useAuth();

  if (checking) {
    return (
      <div className="admin-loading">
        <p>Checking session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
