package com.bus.busticketnew.service;

import com.bus.busticketnew.dto.SeatLayoutDTO;
import com.bus.busticketnew.model.Booking;
import com.bus.busticketnew.model.Trip;
import com.bus.busticketnew.repository.BookingRepository;
import com.bus.busticketnew.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final BookingRepository bookingRepository; // Inject BookingRepository

    public TripService(TripRepository tripRepository, BookingRepository bookingRepository) {
        this.tripRepository = tripRepository;
        this.bookingRepository = bookingRepository;
    }

    // --- Existing Methods ---
    public Trip addTrip(Trip trip) {
        return tripRepository.save(trip);
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + id));
    }

    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }

   
    public List<Trip> searchTrips(String source, String destination, LocalDate date) {
        if (date != null) {
            
            return tripRepository.findTripsByRouteAndDate(
                    source,
                    destination,
                    date.atStartOfDay(), // e.g., 2025-09-03T00:00:00
                    date.plusDays(1).atStartOfDay() // e.g., 2025-09-04T00:00:00
            );
        } else {
            
            return tripRepository.findTripsByRoute(source, destination);
        }
    }

    // --- NEW SEAT LAYOUT METHOD ---
    public SeatLayoutDTO getSeatLayout(Long tripId) {
        // 1. Find the trip to get the bus capacity
        Trip trip = getTripById(tripId); // This will throw an error if trip not found
        int totalSeats = trip.getBus().getCapacity();

        // 2. Find all confirmed bookings for this trip
        List<Booking> confirmedBookings = bookingRepository.findByTripIdAndStatus(tripId, "CONFIRMED");

        // 3. Extract the seat numbers from the bookings
        List<Integer> bookedSeatNumbers = confirmedBookings.stream()
                .map(Booking::getSeatNumber)
                .collect(Collectors.toList());

        // 4. Return the DTO
        return new SeatLayoutDTO(totalSeats, bookedSeatNumbers);
    }
}