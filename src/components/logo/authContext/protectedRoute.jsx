import React, { useContext } from "react"; // 1. useContext import karo
import { Navigate } from "react-router";
// 2. Direct AuthContext import karo (Path sahi check kar lena)
import { AuthContext } from "./authcontext"; 

export const ProtectedRoute = ({ children }) => {
  // 3. useAuth() ki jagah direct useContext use karo
  const { user, loading } = useContext(AuthContext);

  // 4. Jab tak firebase check kar raha hai, wait karo (varna ye seedha login par phenk dega)
  if (loading) {
    return null; // Ya koi chota sa loading spinner
  }

  if (!user) {
    // Agar login nahi hai, toh login page par bhej do
    return <Navigate to="/login" replace />;
  }

  return children;
};