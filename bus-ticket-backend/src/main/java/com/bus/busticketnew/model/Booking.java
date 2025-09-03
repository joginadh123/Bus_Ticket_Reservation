package com.bus.busticketnew.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Link to Trip
    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private int seatNumber;

    @Column(nullable = false)
    private LocalDateTime bookingTime;

    private String status; // e.g. "CONFIRMED", "CANCELLED"

    public Booking() {}

    public Booking(User user, Trip trip, int seatNumber, LocalDateTime bookingTime, String status) {
        this.user = user;
        this.trip = trip;
        this.seatNumber = seatNumber;
        this.bookingTime = bookingTime;
        this.status = status;
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }

    public int getSeatNumber() { return seatNumber; }
    public void setSeatNumber(int seatNumber) { this.seatNumber = seatNumber; }

    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
