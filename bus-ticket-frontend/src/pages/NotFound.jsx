import React from "react";
import { Link } from "react-router-dom"; // CORRECTED: Was "react--router-dom"

export default function NotFound() {
  return (
    <div className="text-center" style={{ marginTop: '5rem' }}>
      <h1 className="display-1 fw-bold">404</h1>
      <p className="fs-3">
        <span className="text-danger">Oops!</span> Page not found.
      </p>
      <p className="lead">
        The page you’re looking for doesn’t exist.
      </p>
      <Link to="/" className="btn btn-brand mt-3">
        Go Home
      </Link>
    </div>
  );
}