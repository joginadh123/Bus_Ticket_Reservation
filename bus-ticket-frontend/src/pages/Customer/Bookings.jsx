import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import * as apiService from '../../services/apiService.js';
import Loader from '../../components/Loader.jsx';           // <-- Extension added
import BookingCard from '../../components/BookingCard.jsx'; // <-- Extension added

export default function Bookings() {
  const { user } = useAuth();
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchBookings = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await apiService.getBookingsByUser(user.id);
      const sorted = response.data.sort((a, b) => new Date(b.trip.departureTime) - new Date(a.trip.departureTime));
      setAllBookings(sorted);
    } catch (err) {
      setError("Failed to load your bookings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const filteredBookings = useMemo(() => {
    const now = new Date();
    if (activeTab === 'upcoming') {
      return allBookings.filter(b => b.status === 'CONFIRMED' && new Date(b.trip.departureTime) > now);
    }
    if (activeTab === 'past') {
      return allBookings.filter(b => b.status === 'CONFIRMED' && new Date(b.trip.departureTime) <= now);
    }
    if (activeTab === 'cancelled') {
      return allBookings.filter(b => b.status === 'CANCELLED');
    }
    return [];
  }, [allBookings, activeTab]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await apiService.cancelBooking(bookingId);
        fetchBookings();
      } catch (err) {
        setError('Failed to cancel the booking. Please try again.');
        console.error(err);
      }
    }
  };

  const handleDownloadTicket = async (bookingId) => {
    try {
      const response = await apiService.downloadETicketPdf(bookingId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `eticket-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download e-ticket.");
      console.error(err);
    }
  };
  
  const renderContent = () => {
    if (loading) return <Loader text="Loading bookings..." />;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (filteredBookings.length === 0) {
      return <div className="text-center text-muted p-4">No {activeTab} bookings.</div>;
    }
    return filteredBookings.map(booking => (
      <BookingCard 
        key={booking.id} 
        booking={booking} 
        onCancel={handleCancelBooking}
        onDownload={handleDownloadTicket}
      />
    ));
  };

  return (
    <div>
      <h2 className="mb-4 text-start">My Bookings</h2>
      <div className="tabs-nav mb-4">
        <button 
          className={`btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}>
          Upcoming
        </button>
        <button 
          className={`btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}>
          Past
        </button>
        <button 
          className={`btn ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}>
          Cancelled
        </button>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
}