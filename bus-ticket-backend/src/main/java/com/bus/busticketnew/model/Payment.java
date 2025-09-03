package com.bus.busticketnew.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to Booking
    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private String paymentMethod; // e.g. CARD, UPI, CASH

    @Column(nullable = false)
    private String status; // SUCCESS, FAILED, PENDING

    @Column(nullable = false)
    private LocalDateTime paymentTime;

    public Payment() {}

    public Payment(Booking booking, double amount, String paymentMethod, String status, LocalDateTime paymentTime) {
        this.booking = booking;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.paymentTime = paymentTime;
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getPaymentTime() { return paymentTime; }
    public void setPaymentTime(LocalDateTime paymentTime) { this.paymentTime = paymentTime; }
}
