import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as apiService from "../../services/apiService.js";
import Loader from "../../components/Loader.jsx";

export default function Ticket() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await apiService.getTicketById(ticketId);
        setTicket(response.data);
      } catch (e) {
        console.error("Failed to load ticket:", e);
        setError(e.response?.data?.message || "Unable to load ticket details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  const downloadPdf = async () => {
    if (!ticket || !ticket.booking?.id) {
        setError("Booking information is missing, cannot download PDF.");
        return;
    };
    try {
      // Use the dedicated backend endpoint to get the PDF
      const response = await apiService.downloadETicketPdf(ticket.booking.id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `e-ticket-${ticket.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up
      window.URL.revokeObjectURL(url); // Free up memory
    } catch (err) {
      console.error("Failed to download ticket PDF:", err);
      setError("Failed to download the e-ticket PDF.");
    }
  };

  if (loading) return <Loader text="Loading your ticket..." />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!ticket) return <div className="alert alert-warning">Ticket data not found.</div>;

  // Destructure for easier access in JSX, with safe-guarding for nested objects
  const { booking, payment, seatNumber, qrCode, issuedAt } = ticket;
  const trip = booking?.trip;
  const route = trip?.route;
  const user = booking?.user;

  return (
    <div className="card card-elev p-4 text-start">
      <h4 className="mb-2">E-Ticket Confirmation</h4>
      <p className="text-muted">
        Your booking is confirmed. Have a safe journey!
      </p>
      <hr />
      <div className="row">
        <div className="col-md-8">
            <p><strong>Ticket ID:</strong> #{ticket.id}</p>
            <p><strong>Passenger:</strong> {user?.name}</p>
            <p><strong>Trip:</strong> {route?.source} &rarr; {route?.destination}</p>
            <p><strong>Departure:</strong> {trip ? new Date(trip.departureTime).toLocaleString() : 'N/A'}</p>
            <p><strong>Seat Number:</strong> {seatNumber}</p>
            <p><strong>Total Fare:</strong> ₹{payment?.amount.toFixed(2)}</p>
            <p className="small text-muted">Issued: {new Date(issuedAt).toLocaleString()}</p>
        </div>
        <div className="col-md-4 text-center">
            {qrCode ? (
                <img
                src={`data:image/png;base64,${qrCode}`}
                alt="Ticket QR Code"
                title="Scan for details"
                style={{ maxWidth: '180px', height: 'auto' }}
                />
            ) : (
                <div className="p-3 bg-light text-muted">QR Code not available</div>
            )}
        </div>
      </div>

      <div className="mt-4">
        <button className="btn btn-brand me-2" onClick={downloadPdf}>
          Download PDF Ticket
        </button>
        <Link className="btn btn-outline-secondary" to="/customer/search">
          Book Another Trip
        </Link>
      </div>
    </div>
  );
}