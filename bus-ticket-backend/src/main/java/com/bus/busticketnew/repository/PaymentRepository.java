package com.bus.busticketnew.repository;

import com.bus.busticketnew.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
