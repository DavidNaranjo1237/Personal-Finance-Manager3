package com.base.app.controller;

import com.base.app.model.Ingreso;
import com.base.app.service.IngresoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingresos")
// Agregamos permiso para que el Frontend (puerto 3000) pueda hablar con el Backend
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class IngresoController {

    @Autowired
    private IngresoService ingresoService;

    @PostMapping
    public ResponseEntity<String> guardarIngreso(@Valid @RequestBody Ingreso ingreso) {
        try {
            String mensaje = ingresoService.guardarIngreso(ingreso);
            return ResponseEntity.ok(mensaje);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Ingreso>> obtenerIngresos() {
        return ResponseEntity.ok(ingresoService.obtenerIngresos());
    }
}