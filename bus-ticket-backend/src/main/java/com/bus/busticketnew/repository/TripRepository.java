package com.bus.busticketnew.repository;

import com.bus.busticketnew.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    // Search for trips matching source, destination, and on a specific day
    @Query("SELECT t FROM Trip t WHERE " +
           "LOWER(t.route.source) = LOWER(:source) AND " +
           "LOWER(t.route.destination) = LOWER(:destination) AND " +
           "t.departureTime >= :startOfDay AND t.departureTime < :endOfDay")
    List<Trip> findTripsByRouteAndDate(@Param("source") String source,
                                       @Param("destination") String destination,
                                       @Param("startOfDay") LocalDateTime startOfDay,
                                       @Param("endOfDay") LocalDateTime endOfDay);

    // Search for trips matching just source and destination (for any date)
    @Query("SELECT t FROM Trip t WHERE " +
           "LOWER(t.route.source) = LOWER(:source) AND " +
           "LOWER(t.route.destination) = LOWER(:destination)")
    List<Trip> findTripsByRoute(@Param("source") String source,
                                @Param("destination") String destination);
}