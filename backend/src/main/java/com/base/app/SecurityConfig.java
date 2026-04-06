package com.base.app;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Activar CORS con la configuración definida abajo
            .cors(Customizer.withDefaults()) 
            // 2. Desactivar CSRF (necesario para APIs REST con Stateless Auth)
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // 3. PERMITIR RUTAS PÚBLICAS Y MÉTODOS ESPECÍFICOS
.requestMatchers("/", "/api/auth/**").permitAll()
.requestMatchers(HttpMethod.GET, "/api/ingresos/**", "/api/gastos/**").permitAll()
.requestMatchers(HttpMethod.POST, "/api/ingresos/**", "/api/gastos/**").permitAll()

// 4. IMPORTANTE: Permitir explícitamente todas las peticiones OPTIONS (Preflight)
.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

// 5. Todo lo demás requiere autenticación
.anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permitimos cualquier origen para desarrollo (evita conflictos de IP/localhost)
        configuration.setAllowedOriginPatterns(List.of("*")); 
        
        // Métodos permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        
        // Headers que React suele enviar
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "X-Requested-With", 
            "Accept", 
            "Origin", 
            "Access-Control-Request-Method", 
            "Access-Control-Request-Headers"
        ));
        
        // Headers que el navegador debe poder leer
        configuration.setExposedHeaders(Arrays.asList("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
        
        // Permitir envío de cookies/auth headers
        configuration.setAllowCredentials(true);
        
        // Cachear la respuesta de CORS por 1 hora
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Registro de la configuración para todas las rutas
        source.registerCorsConfiguration("/**", configuration); 
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationConfiguration authenticationConfiguration() {
        return new AuthenticationConfiguration();
    }
}