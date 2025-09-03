import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "./Loader.jsx"; // Import the Loader component

export default function ProtectedRoute() {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  // If we are still checking for authentication, show a loading spinner
  if (isAuthLoading) {
    return <Loader text="Authenticating..." />;
  }

  // If the check is done and there is no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If the check is done and there IS a user, render the child component (e.g., Checkout page)
  return <Outlet />;
}