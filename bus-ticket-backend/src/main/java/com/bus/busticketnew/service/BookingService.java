package com.bus.busticketnew.service;

import com.bus.busticketnew.model.Booking;
import com.bus.busticketnew.repository.BookingRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.text.Document;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(Booking booking) {
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus("CONFIRMED");
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public void cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            booking.setStatus("CANCELLED");
            bookingRepository.save(booking);
        }
    }
    public byte[] generateETicket(Long bookingId) throws Exception {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Generate QR Code
        String qrContent = "Booking ID: " + booking.getId();
        BitMatrix matrix = new QRCodeWriter().encode(qrContent, BarcodeFormat.QR_CODE, 200, 200);
        ByteArrayOutputStream qrOut = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", qrOut);

        // Create PDF
        Document document = new Document();
        ByteArrayOutputStream pdfOut = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, pdfOut);
        document.open();
        document.add(new Paragraph("E-Ticket for Booking #" + booking.getId()));
        document.add(new Paragraph("Bus: " + booking.getId()));
        document.add(new Paragraph("Seat: " + booking.getSeatNumber()));
        document.add(new Paragraph("Passenger: " + booking.getUser().getName()));

        Image qrImg = Image.getInstance(qrOut.toByteArray());
        qrImg.scaleToFit(150, 150);
        document.add(qrImg);

        document.close();
        return pdfOut.toByteArray();
    }
}
