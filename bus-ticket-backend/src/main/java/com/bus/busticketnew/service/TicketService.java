package com.bus.busticketnew.service;

import com.bus.busticketnew.model.Booking;
import com.bus.busticketnew.model.Payment;
import com.bus.busticketnew.model.Ticket;
import com.bus.busticketnew.repository.BookingRepository;
import com.bus.busticketnew.repository.PaymentRepository;
import com.bus.busticketnew.repository.TicketRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public TicketService(TicketRepository ticketRepository,
                         BookingRepository bookingRepository,
                         PaymentRepository paymentRepository) {
        this.ticketRepository = ticketRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    public Ticket generateTicket(Long bookingId, Long paymentId) throws Exception {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new Exception("Booking not found"));
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new Exception("Payment not found"));

        Ticket ticket = new Ticket();
        ticket.setBooking(booking);
        ticket.setPayment(payment);
        ticket.setSeatNumber(booking.getSeatNumber()); // Booking must have seatNumber
        ticket.setIssuedAt(LocalDateTime.now());

        String qrText = "TicketID:" + bookingId + "-Seat:" + ticket.getSeatNumber();
        ticket.setQrCode(generateQRCodeBase64(qrText));

        return ticketRepository.save(ticket);
    }

    private String generateQRCodeBase64(String text) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 200, 200);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return Base64.getEncoder().encodeToString(pngOutputStream.toByteArray());
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }
}
