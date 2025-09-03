package com.bus.busticketnew.controller;

import com.bus.busticketnew.model.Ticket;
import com.bus.busticketnew.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/generate/{bookingId}/{paymentId}")
    public ResponseEntity<?> generateTicket(@PathVariable Long bookingId, @PathVariable Long paymentId) {
        try {
            Ticket ticket = ticketService.generateTicket(bookingId, paymentId);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to generate ticket: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> listTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
