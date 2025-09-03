package com.bus.busticketnew.repository;

import com.bus.busticketnew.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRepository extends JpaRepository<Bus, Long> {
}
