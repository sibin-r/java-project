package com.charity.charity.controller;

import com.charity.charity.model.User;
import com.charity.charity.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:8080") // Allow CORS for frontend requests
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        User existingUser = userService.getUserByUsername(loginRequest.getUsername());
        if (existingUser == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        // NOTE: Password check logic should be added here (e.g., if using encrypted passwords)
        if (!existingUser.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(401).body("Invalid password");
        }

        return ResponseEntity.ok(existingUser);
    }
}
