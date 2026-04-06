package com.base.app.service;

import com.base.app.AuthDTO;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final Map<String, String> demoUser = new HashMap<>() {{
        put("email", "demo@gamezone.com");
        put("password", passwordEncoder.encode("Prueba123*"));
    }};

    public Map<String, Object> authenticate(AuthDTO authDTO) {
        if (demoUser.get("email").equals(authDTO.getEmail()) &&
            passwordEncoder.matches(authDTO.getPassword(), demoUser.get("password"))) {

            Map<String, Object> response = new HashMap<>();
            response.put("token", UUID.randomUUID().toString());
            response.put("email", demoUser.get("email"));
            return response;
        }
        throw new RuntimeException("Invalid credentials");
    }
}