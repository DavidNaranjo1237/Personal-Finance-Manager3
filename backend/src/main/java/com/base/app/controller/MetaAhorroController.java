package com.base.app.controller;

import com.base.app.dto.MetaAhorroResponseDTO;
import com.base.app.model.MetaAhorro;
import com.base.app.service.MetaAhorroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/metas")
@CrossOrigin(origins = "*")
public class MetaAhorroController {

    private final MetaAhorroService metaAhorroService;

    public MetaAhorroController(MetaAhorroService metaAhorroService) {
        this.metaAhorroService = metaAhorroService;
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody MetaAhorro meta) {
        try {
            return ResponseEntity.ok(metaAhorroService.crear(meta));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<MetaAhorroResponseDTO>> listar() {
        return ResponseEntity.ok(metaAhorroService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(metaAhorroService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody MetaAhorro datos) {
        try {
            return ResponseEntity.ok(metaAhorroService.editar(id, datos));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            metaAhorroService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Meta eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}