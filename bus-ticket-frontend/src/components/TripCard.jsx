import React from "react";
import { Link } from "react-router-dom";
import { FiClock, FiMapPin } from "react-icons/fi";

export default function TripCard({ trip }){
  return (
    <div className="card card-elev mb-3 p-3">
      <div className="d-flex flex-wrap align-items-center justify-content-between">
        <div className="d-flex flex-column">
          <div className="fw-semibold fs-5">{trip.source} → {trip.destination}</div>
          <div className="text-muted small d-flex gap-3">
            <span className="d-flex align-items-center gap-1"><FiClock /> {new Date(trip.departureTime).toLocaleString()}</span>
            <span className="d-flex align-items-center gap-1"><FiMapPin /> Trip #{trip.id}</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="fs-5 fw-semibold">₹{trip.fare}</div>
          <Link to={`/customer/trips/${trip.id}/seats`} className="btn btn-brand">Select Seats</Link>
        </div>
      </div>
    </div>
  );
}
