import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as apiService from "../../services/apiService.js"; // Corrected path
import { useAuth } from '../../context/AuthContext.jsx';      // Corrected path

export default function Checkout() {
  const { state } = useLocation(); // Get data from Seat Selection page
  const navigate = useNavigate();
  const { user } = useAuth(); // Get authenticated user from context
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // This check is very important. If the user navigates here directly,
  // there will be no state and the page cannot function.
  if (!state || !state.tripId || !state.seatNumbers || state.seatNumbers.length === 0) {
    return (
      <div className="alert alert-warning text-center">
        <h4>Invalid Checkout State</h4>
        <p>No checkout data was found. Please go back and select your seats first.</p>
      </div>
    );
  }

  const { tripId, seatNumbers, hold, fare } = state;

  const onPay = async () => {
    setError("");
    if (!user?.id) {
        setError("You must be logged in to complete a booking.");
        return;
    }
    setLoading(true);

    try {
      // This function in apiService handles the multi-step backend process
      const response = await apiService.checkout({
        tripId,
        seatNumbers,
        holdId: hold?.holdId,
        userId: user.id // Pass the logged-in user's ID
      });

      const newTicketId = response.data.ticketId;
      // On success, redirect to the ticket page
      navigate(`/customer/ticket/${newTicketId}`, { replace: true });

    } catch (e) {
      setError(e.message || "Payment and booking failed. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Your backend currently books one seat at a time. This calculates the total fare for the UI.
  const totalFare = seatNumbers.length * fare;

  return (
    <div className="d-flex justify-content-center">
      <div className="card card-elev p-4" style={{ minWidth: '450px', maxWidth: '500px' }}>
        <h3 className="mb-3 text-center">Confirm Your Booking</h3>
        <hr />
        <div className="mb-2">
          <h5>Trip Details</h5>
          <p className="mb-1"><strong>Trip ID:</strong> #{tripId}</p>
          {/* You could pass more trip details like source/destination in the state if you want to display them here */}
        </div>
        <div className="mb-3">
          <h5>Booking Summary</h5>
          <p className="mb-1"><strong>Selected Seats:</strong> <span className="fw-bold fs-5">{seatNumbers.join(", ")}</span></p>
          <p className="mb-1"><strong>Total Fare:</strong> <span className="fw-bold fs-4 text-success">₹{totalFare.toFixed(2)}</span></p>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}

        <button disabled={loading} className="btn btn-brand w-100 btn-lg mt-2" onClick={onPay}>
          {loading ? "Processing..." : "Pay and Confirm"}
        </button>
      </div>
    </div>
  );
}