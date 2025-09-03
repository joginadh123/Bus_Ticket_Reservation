package com.bus.busticketnew.controller;

import com.bus.busticketnew.model.Bus;
import com.bus.busticketnew.service.BusService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buses")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @PostMapping
    public Bus addBus(@RequestBody Bus bus) {
        return busService.addBus(bus);
    }

    @GetMapping
    public List<Bus> getAllBuses() {
        return busService.getAllBuses();
    }

    @GetMapping("/{id}")
    public Bus getBusById(@PathVariable Long id) {
        return busService.getBusById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return "Bus deleted successfully";
    }
}
