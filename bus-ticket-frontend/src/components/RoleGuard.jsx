import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RoleGuard({ allowed = [] }){
  const { user } = useAuth();
  if(!user) return <Navigate to="/login" replace />;
  if(!allowed.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
