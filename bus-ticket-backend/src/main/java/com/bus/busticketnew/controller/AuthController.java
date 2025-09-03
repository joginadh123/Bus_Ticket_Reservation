package com.bus.busticketnew.controller;

import com.bus.busticketnew.model.User;
import com.bus.busticketnew.repository.UserRepository;
import com.bus.busticketnew.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    // DTOs
    record RegisterRequest(String name, String email, String password, String role) {}
    record LoginRequest(String email, String password) {}
    record JwtResponse(String token, Long id, String name, String email, String role) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.findByEmail(req.email()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setRole(req.role());
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        User user = userRepository.findByEmail(req.email()).orElseThrow();

        String token = jwtUtils.generateToken(userDetails, user.getRole(), user.getId(), user.getName());

        return ResponseEntity.ok(new JwtResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole()));
    }
}
