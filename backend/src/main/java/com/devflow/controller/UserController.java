package com.devflow.controller;

import com.devflow.model.User;
import com.devflow.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User newUser) {
        if (newUser.getPassword() == null || newUser.getPassword().isEmpty()) {
            newUser.setPassword("welcome123");
        }
        if (newUser.getRole() == null) {
            newUser.setRole("Member");
        }
        if (newUser.getAvatar() == null) {
            newUser.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + (newUser.getName() != null ? newUser.getName() : "user"));
        }
        return ResponseEntity.ok(userRepository.save(newUser));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<User> updateRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(body.get("role"));
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/profile")
    public ResponseEntity<User> updateProfile(@PathVariable String id, @RequestBody User profileUpdate) {
        return userRepository.findById(id)
                .map(user -> {
                    if (profileUpdate.getName() != null) user.setName(profileUpdate.getName());
                    if (profileUpdate.getRole() != null) user.setRole(profileUpdate.getRole());
                    if (profileUpdate.getLocation() != null) user.setLocation(profileUpdate.getLocation());
                    if (profileUpdate.getBio() != null) user.setBio(profileUpdate.getBio());
                    if (profileUpdate.getPhone() != null) user.setPhone(profileUpdate.getPhone());
                    if (profileUpdate.getAvatar() != null) user.setAvatar(profileUpdate.getAvatar());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
