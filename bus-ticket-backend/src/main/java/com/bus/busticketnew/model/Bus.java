package com.bus.busticketnew.model;

import jakarta.persistence.*;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String busNumber;

    @Column(nullable = false)
    private String type;  // e.g. AC, Non-AC, Sleeper

    @Column(nullable = false)
    private int capacity;
    
    public Bus() {}

    public Bus(String busNumber, String type, int capacity) {
        this.busNumber = busNumber;
        this.type = type;
        this.capacity = capacity;
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
}
