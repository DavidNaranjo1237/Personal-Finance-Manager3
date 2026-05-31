package com.base.app.controller;

import com.base.app.dto.AlertaPresupuestoDTO;
import com.base.app.dto.PresupuestoResponseDTO;
import com.base.app.model.Presupuesto;
import com.base.app.service.PresupuestoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/presupuestos")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class PresupuestoController {

    @Autowired
    private PresupuestoService presupuestoService;

    @PostMapping
    public ResponseEntity<?> guardarPresupuesto(@Valid @RequestBody Presupuesto presupuesto) {
        try {
            String mensaje = presupuestoService.guardarPresupuesto(presupuesto);
            return ResponseEntity.ok(Map.of("message", mensaje));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor"));
        }
    }

    @GetMapping("/estado")
    public ResponseEntity<List<PresupuestoResponseDTO>> obtenerEstadoPresupuestos() {
        return ResponseEntity.ok(presupuestoService.obtenerEstadoPresupuestos());
    }

    // HU08: Alertas activas
    @GetMapping("/alertas")
    public ResponseEntity<List<AlertaPresupuestoDTO>> getAlertas() {
        return ResponseEntity.ok(presupuestoService.getAlertas());
    }
}