package com.inklink.backend.controller;

import com.inklink.backend.model.LoginRequest;
import com.inklink.backend.model.User;
import com.inklink.backend.security.JwtUtil;
import com.inklink.backend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        User user = userService.getUserByMail(request.getMail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenziali non valide");
        }
        String token = jwtUtil.generateToken(user.getMail());
        return Map.of(
                "token", token,
                "userId", user.getId(),
                "name", user.getName()
        );
    }
}