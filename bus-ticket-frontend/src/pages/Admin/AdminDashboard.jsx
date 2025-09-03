import React from "react";
import { Link } from "react-router-dom";
import { FaBus, FaRoute, FaCalendarAlt } from "react-icons/fa";
import "./AdminDashboard.css"; // Import the new stylesheet

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard page">
      <div className="dashboard-header text-start">
        <h2>Admin Dashboard</h2>
        <p className="text-muted">Select a category to manage your resources.</p>
      </div>
      
      <div className="dashboard-grid">
        {/* Buses Card */}
        <div className="mgmt-card">
          <div className="icon-wrapper">
            <FaBus />
          </div>
          <div className="card-title">Buses</div>
          <div className="card-description">
            Add, view, and manage the buses in your fleet.
          </div>
          <Link to="/admin/buses" className="btn-manage">
            Manage Buses
          </Link>
        </div>

        {/* Routes Card */}
        <div className="mgmt-card">
          <div className="icon-wrapper">
            <FaRoute />
          </div>
          <div className="card-title">Routes</div>
          <div className="card-description">
            Define all available travel routes and their distances.
          </div>
          <Link to="/admin/routes" className="btn-manage">
            Manage Routes
          </Link>
        </div>

        {/* Trips Card */}
        <div className="mgmt-card">
          <div className="icon-wrapper">
            <FaCalendarAlt />
          </div>
          <div className="card-title">Trips</div>
          <div className="card-description">
            Schedule new trips by assigning buses to your routes.
          </div>
          <Link to="/admin/trips" className="btn-manage">
            Manage Trips
          </Link>
        </div>
      </div>
    </div>
  );
}