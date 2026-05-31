package com.base.app.controller;

import com.base.app.model.Ingreso;
import com.base.app.service.IngresoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ingresos")
// Agregamos permiso para que el Frontend (puerto 3000) pueda hablar con el Backend
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
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

    @PutMapping("/{id}")
    public ResponseEntity<?> editarIngreso(@PathVariable Long id, @RequestBody Ingreso datos) {
        try {
            return ResponseEntity.ok(ingresoService.editarIngreso(id, datos));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarIngreso(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ingresoService.eliminarIngreso(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}