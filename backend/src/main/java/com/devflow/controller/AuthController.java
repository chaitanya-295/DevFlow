package com.devflow.controller;

import com.devflow.model.User;
import com.devflow.repository.UserRepository;
import com.devflow.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.containsKey("fullName") ? request.get("fullName") : request.get("name");
        String password = request.get("password");
        String role = request.getOrDefault("role", "DEVELOPER");

        if (userRepository.existsByEmail(email)) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Email already in use");
            return ResponseEntity.badRequest().body(err);
        }

        String springRole = "ROLE_" + role.toUpperCase();
        User user = new User(email, name, passwordEncoder.encode(password), springRole);
        user.setRole(role);
        user.setAvatar(request.get("avatar")); // null by default if not provided
        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole());
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        return userRepository.findByEmail(email)
                .map(user -> {
                    if (passwordEncoder.matches(password, user.getPassword())) {
                        String token = jwtUtils.generateToken(user.getEmail(), user.getRole());
                        Map<String, Object> res = new HashMap<>();
                        res.put("token", token);
                        res.put("user", user);
                        return ResponseEntity.ok(res);
                    }
                    Map<String, String> err = new HashMap<>();
                    err.put("error", "Invalid credentials");
                    return ResponseEntity.status(401).body((Object) err);
                })
                .orElseGet(() -> {
                    Map<String, String> err = new HashMap<>();
                    err.put("error", "No account found with this email. Please register first.");
                    return ResponseEntity.status(401).body(err);
                });
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Default demo user fallback for quick inspection
            return userRepository.findByEmail("lucy.pearl@company.com")
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.ok(new User("lucy.pearl@company.com", "Lucy Pearl", "", "ROLE_ADMIN")));
        }

        String token = authHeader.substring(7);
        if (!jwtUtils.validateToken(token)) {
            return ResponseEntity.status(401).build();
        }

        String email = jwtUtils.getEmailFromToken(token);
        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
