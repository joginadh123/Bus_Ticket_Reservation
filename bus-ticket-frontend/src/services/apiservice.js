import { api } from "./api";

// --- User/Auth Endpoints ---
export const registerUser = (userData) => api.post("/users/register", userData);
export const loginUser = (credentials) => api.post("/users/login", credentials);
export const getAllUsers = () => api.get("/users");

// --- Admin Endpoints ---
export const addBus = (busData) => api.post("/buses", busData);
export const getAllBuses = () => api.get("/buses");
export const deleteBus = (id) => api.delete(`/buses/${id}`);

export const addRoute = (routeData) => api.post("/routes", routeData);
export const getAllRoutes = () => api.get("/routes");
export const deleteRoute = (id) => api.delete(`/routes/${id}`);

export const addTrip = (tripData) => api.post("/trips", tripData);
export const getAllTrips = () => api.get("/trips");
export const deleteTrip = (id) => api.delete(`/trips/${id}`);

export const getAllBookings = () => api.get("/bookings");
export const getAllPayments = () => api.get("/payments");

// --- Public/Customer Endpoints ---
export const getTripById = (id) => api.get(`/trips/${id}`);

export const searchTrips = async ({ source, destination, date }) => {
  const params = new URLSearchParams({ source, destination });
  if (date) {
    params.append('date', date);
  }
  return api.get(`/trips/search?${params.toString()}`);
};

export const getTripSeats = (tripId) => api.get(`/trips/${tripId}/seats`);

// --- Booking, Payment, Ticket Flow ---
export const createBooking = (bookingData) => api.post("/bookings", bookingData);
export const getBookingsByUser = (userId) => api.get(`/bookings/user/${userId}`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
export const downloadETicketPdf = (bookingId) => api.get(`/bookings/${bookingId}/download-ticket`, { responseType: 'arraybuffer' });
export const processPayment = (paymentData) => api.post("/payments", paymentData);
export const generateTicket = (bookingId, paymentId) => api.post(`/tickets/generate/${bookingId}/${paymentId}`);
export const getTicketById = (id) => api.get(`/tickets/${id}`);

// --- REMAINING MOCK - Hold Seats ---
// NOTE: The backend endpoint for holding seats is still needed for a production environment.
export const holdSeats = async (tripId, seatNumbers) => {
  console.warn("Backend /trips/{id}/hold-seats endpoint is not implemented. Using mock hold.");
  return new Promise(resolve => setTimeout(() => resolve({
    data: {
      holdId: `mock-hold-${Date.now()}`,
      expiresInSec: 300, // 5 minutes
      tripId,
      seatNumbers
    }
  }), 500));
};

// --- UPDATED CHECKOUT LOGIC FOR MULTIPLE SEATS ---
export const checkout = async ({ tripId, seatNumbers, userId }) => {
  try {
    // Get trip details once to get the fare
    const tripRes = await getTripById(tripId);
    const trip = tripRes.data;
    
    let lastTicketId = null;

    // Loop through each selected seat and create a full booking for it
    for (const seat of seatNumbers) {
      // 1. Create the booking for this specific seat
      const bookingData = {
        user: { id: userId },
        trip: { id: tripId },
        seatNumber: seat, // Use the current seat from the loop
        status: "CONFIRMED"
      };
      const bookingRes = await createBooking(bookingData);
      const booking = bookingRes.data;

      // 2. Process the payment for this booking
      const paymentData = {
        booking: { id: booking.id },
        amount: trip.fare, // Use the fare from the trip details
        paymentMethod: "CARD",
        status: "SUCCESS"
      };
      const paymentRes = await processPayment(paymentData);
      const payment = paymentRes.data;

      // 3. Generate the ticket for this booking and payment
      const ticketRes = await generateTicket(booking.id, payment.id);
      const ticket = ticketRes.data;

      // Store the ID of the last ticket created
      lastTicketId = ticket.id;
    }

    // If a ticket was successfully created, return its ID to redirect the user
    if (lastTicketId) {
      return { data: { ticketId: lastTicketId } };
    } else {
      throw new Error("Ticket generation failed for all selected seats.");
    }

  } catch (error) {
    // NEW: Improved error handling to provide a clearer message
    console.error("Checkout failed:", error);
    let errorMessage = "Checkout failed. Please try again.";
    if (error.response?.data) {
        // If the backend sends a specific error message string
        errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
    } else if (error.message) {
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};