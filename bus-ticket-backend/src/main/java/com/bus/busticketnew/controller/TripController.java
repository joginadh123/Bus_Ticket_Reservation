package com.bus.busticketnew.controller;

import com.bus.busticketnew.dto.SeatLayoutDTO;
import com.bus.busticketnew.model.Trip;
import com.bus.busticketnew.service.TripService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    // ADMIN Endpoints
    @PostMapping
    public Trip addTrip(@RequestBody Trip trip) {
        return tripService.addTrip(trip);
    }

    @DeleteMapping("/{id}")
    public String deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return "Trip deleted successfully";
    }

    // PUBLIC Endpoints
    @GetMapping
    public List<Trip> getAllTrips() {
        // This can be used by admins, or for a general "all trips" view
        return tripService.getAllTrips();
    }

    @GetMapping("/{id}")
    public Trip getTripById(@PathVariable Long id) {
        return tripService.getTripById(id);
    }

    // --- NEW SEARCH ENDPOINT for customers ---
    @GetMapping("/search")
    public ResponseEntity<List<Trip>> searchTrips(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        List<Trip> trips = tripService.searchTrips(source, destination, date);
        return ResponseEntity.ok(trips);
    }

    // --- NEW SEAT LAYOUT ENDPOINT for customers ---
    @GetMapping("/{id}/seats")
    public ResponseEntity<SeatLayoutDTO> getTripSeatLayout(@PathVariable Long id) {
        SeatLayoutDTO seatLayout = tripService.getSeatLayout(id);
        return ResponseEntity.ok(seatLayout);
    }
}