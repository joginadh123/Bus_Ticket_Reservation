import React from 'react';
import { FaCalendarAlt, FaChair, FaInfoCircle, FaDownload, FaTimesCircle } from 'react-icons/fa';

export default function BookingCard({ booking, onCancel, onDownload }) {
  const isUpcoming = booking.status === 'CONFIRMED' && new Date(booking.trip.departureTime) > new Date();

  return (
    <div className="card card-elev mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-1">{booking.trip.route.source} &rarr; {booking.trip.route.destination}</h5>
            <p className="text-muted small">Booking ID: #{booking.id}</p>
          </div>
          <span className={`badge ${booking.status === 'CONFIRMED' ? 'bg-success-soft' : 'bg-danger-soft'}`}>
            {booking.status}
          </span>
        </div>
        <hr />
        <div className="row g-3">
          <div className="col-md-6 d-flex align-items-center">
            <FaCalendarAlt className="me-2 text-primary" />
            <span><strong>Departure:</strong> {new Date(booking.trip.departureTime).toLocaleString()}</span>
          </div>
          <div className="col-md-6 d-flex align-items-center">
            <FaChair className="me-2 text-primary" />
            <span><strong>Seat:</strong> {booking.seatNumber}</span>
          </div>
          <div className="col-md-6 d-flex align-items-center">
            <FaInfoCircle className="me-2 text-primary" />
            <span><strong>Bus No:</strong> {booking.trip.bus.busNumber}</span>
          </div>
        </div>
        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-brand btn-sm" onClick={() => onDownload(booking.id)}>
            <FaDownload className="me-1" /> Download Ticket
          </button>
          {isUpcoming && (
            <button className="btn btn-outline-danger btn-sm" onClick={() => onCancel(booking.id)}>
              <FaTimesCircle className="me-1" /> Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}