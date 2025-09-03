package com.bus.busticketnew.repository;

import com.bus.busticketnew.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    // New method to find all bookings for a trip with a specific status
    List<Booking> findByTripIdAndStatus(Long tripId, String status);
}