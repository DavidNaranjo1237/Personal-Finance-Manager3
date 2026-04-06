# IAM Module Documentation

## Overview
This document provides an overview of the Identity and Access Management (IAM) module implemented for the Personal Finance Manager API. The module is designed to handle user authentication using Spring Boot and Spring Security.

## Components

### 1. AuthDTO
- **Location**: `com.base.app`
- **Purpose**: Maps the login request payload.
- **Validation**:
  - `@NotBlank` ensures fields are not empty.
  - `@Email` validates the email format.

### 2. AuthController
- **Location**: `com.base.app.controller`
- **Endpoint**: `/api/auth/login`
- **Purpose**: Handles login requests.
- **Behavior**:
  - Validates the request body using `@Valid`.
  - Delegates authentication to `AuthService`.
  - Returns:
    - `200 OK` with a token and user details on success.
    - `401 Unauthorized` with "Credenciales inválidas" on failure.

### 3. AuthService
- **Location**: `com.base.app.service`
- **Purpose**: Validates user credentials.
- **Implementation**:
  - Hardcoded demo user:
    - Email: `demo@gamezone.com`
    - Password: `Prueba123*` (hashed with `BCryptPasswordEncoder`).
  - Generates a UUID token on successful authentication.
  - Throws `RuntimeException` for invalid credentials.

### 4. SecurityConfig
- **Location**: `com.base.app`
- **Purpose**: Configures Spring Security.
- **Key Settings**:
  - Disables CSRF for simplicity.
  - Permits unauthenticated access to `/api/auth/login`.
  - Requires authentication for all other endpoints.
  - Configures `BCryptPasswordEncoder` for password hashing.

## Testing Scenarios

### Scenario 1: Successful Login
- **Given**: A POST request to `/api/auth/login` with valid credentials.
- **When**: The credentials match the demo user.
- **Then**: Returns `200 OK` with a token and user details.

### Scenario 2: Invalid Credentials
- **Given**: A POST request to `/api/auth/login` with invalid credentials.
- **When**: The credentials do not match the demo user.
- **Then**: Returns `401 Unauthorized` with "Credenciales inválidas".

### Scenario 3: Request Body Validation
- **Given**: A POST request to `/api/auth/login` with missing fields.
- **When**: The request body is incomplete.
- **Then**: Returns `400 Bad Request` with validation error messages.

### Scenario 4: User Context
- **Given**: An authenticated user.
- **When**: The user performs subsequent operations.
- **Then**: The system retrieves the user ID from the `SecurityContext`.

## Future Enhancements
- Replace the hardcoded user with a database-backed repository.
- Implement JWT for token generation and validation.
- Add role-based access control (RBAC).

## Author
Senior Java Developer