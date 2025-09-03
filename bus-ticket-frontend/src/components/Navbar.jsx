import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FiLogOut, FiUser } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg app-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          PJ Buses
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="nav">
          {/* Main Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link" to={user.role === 'ADMIN' ? '/admin' : '/customer/search'}>
                  {user.role === 'ADMIN' ? 'Dashboard' : 'Search Trips'}
                </NavLink>
              </li>
            )}
            
            {user?.role === "CUSTOMER" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/customer/bookings">
                  My Bookings
                </NavLink>
              </li>
            )}

            {user?.role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/buses">
                    Buses
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/routes">
                    Routes
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/trips">
                    Trips
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Authentication Links */}
          <ul className="navbar-nav ms-auto">
            {!user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="btn btn-light" to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle d-flex align-items-center" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <FiUser className="me-2" /> {user.name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <div className="dropdown-item-text">
                      <strong>{user.name}</strong>
                      <br />
                      <span className="text-muted">{user.role}</span>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={onLogout}>
                      <FiLogOut className="me-2" /> Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}