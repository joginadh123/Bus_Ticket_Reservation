package com.bus.busticketnew.controller;

import com.bus.busticketnew.model.Route;
import com.bus.busticketnew.service.RouteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping
    public Route addRoute(@RequestBody Route route) {
        return routeService.addRoute(route);
    }

    @GetMapping
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    @GetMapping("/{id}")
    public Route getRouteById(@PathVariable Long id) {
        return routeService.getRouteById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return "Route deleted successfully";
    }
}
