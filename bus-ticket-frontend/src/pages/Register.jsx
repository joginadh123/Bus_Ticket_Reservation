import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // The role is fixed to 'CUSTOMER' for public registration.
  // Admins should be created via a different mechanism (e.g., database script or a special admin panel).
  const [role] = useState("CUSTOMER"); 
  const [error, setError] = useState("");

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name.trim())) {
      return "Name should only contain letters and spaces.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return null; // No validation error
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const res = await register({ name, email, password, role });

    if (!res.ok) {
      // The error message from the backend is preferred as it will be more specific (e.g., "Email already exists")
      setError(res.error); 
    } else {
      // On successful registration, redirect to the login page with a success message
      navigate("/login", { 
        replace: true,
        state: { message: "Registration successful! Please log in." } 
      });
    }
  };

  return (
    <div className="container" style={{ maxWidth: 540 }}>
      <div className="card card-elev p-4 mt-4">
        <h3 className="mb-3 text-center">Create Your Account</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {/* The role selection is removed from the UI for security. 
              Public users should only be able to register as CUSTOMER. */}

          <button disabled={loading} className="btn btn-brand w-100">
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-3 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}