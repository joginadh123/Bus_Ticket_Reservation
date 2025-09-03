package com.bus.busticketnew.service;

import com.bus.busticketnew.model.Route;
import com.bus.busticketnew.repository.RouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public Route addRoute(Route route) {
        return routeRepository.save(route);
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Route getRouteById(Long id) {
        return routeRepository.findById(id).orElse(null);
    }

    public void deleteRoute(Long id) {
        routeRepository.deleteById(id);
    }
}
