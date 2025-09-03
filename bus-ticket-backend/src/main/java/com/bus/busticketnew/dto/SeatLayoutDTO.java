package com.bus.busticketnew.dto;

import java.util.List;

public record SeatLayoutDTO(
    int totalSeats,
    List<Integer> bookedSeats
) {}