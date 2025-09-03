package com.bus.busticketnew.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "routes")
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Source must contain only letters")
    @Column(nullable = false)
    private String source;

    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Destination must contain only letters")
    @Column(nullable = false)
    private String destination;


    private int distance; // in km

    public Route() {}

    public Route(String source, String destination, int distance) {
        this.source = source;
        this.destination = destination;
        this.distance = distance;
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public int getDistance() { return distance; }
    public void setDistance(int distance) { this.distance = distance; }
}
