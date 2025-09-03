import React from "react";
import { Routes, Route } from "react-router-dom";

// Core Components
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleGuard from "./components/RoleGuard.jsx";

// Page Components
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";

// Customer Pages
import Bookings from "./pages/Customer/Bookings.jsx";
import SearchTrips from "./pages/Customer/SearchTrips.jsx";
import SeatSelection from "./pages/Customer/SeatSelection.jsx";
import Checkout from "./pages/Customer/Checkout.jsx";
import Ticket from "./pages/Customer/Ticket.jsx";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import ManageBuses from "./pages/Admin/ManageBuses.jsx";
import ManageRoutes from "./pages/Admin/ManageRoutes.jsx";
import ManageTrips from "./pages/Admin/ManageTrips.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container-fluid mt-4 mb-5">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (must be logged in) */}
          <Route element={<ProtectedRoute />}>
            
            {/* Customer-only Routes */}
            <Route element={<RoleGuard allowed={["CUSTOMER"]} />}>
              <Route path="/customer/search" element={<SearchTrips />} />
              <Route path="/customer/bookings" element={<Bookings />} />
              <Route path="/customer/trips/:id/seats" element={<SeatSelection />} />
              <Route path="/customer/checkout" element={<Checkout />} />
              <Route path="/customer/ticket/:ticketId" element={<Ticket />} />
            </Route>

            {/* Admin-only Routes */}
            <Route element={<RoleGuard allowed={["ADMIN"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/buses" element={<ManageBuses />} />
              <Route path="/admin/routes" element={<ManageRoutes />} />
              <Route path="/admin/trips" element={<ManageTrips />} />
            </Route>

          </Route>

          {/* Catch-all Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}