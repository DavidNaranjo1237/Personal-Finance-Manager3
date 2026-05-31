package com.base.app.controller;

import com.base.app.model.Gasto;
import com.base.app.service.GastoService;
import com.base.app.dto.TransaccionDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gastos")
/**
 * Mantenemos CrossOrigin aquí por seguridad, aunque SecurityConfig ya lo maneje globalmente.
 * Esto asegura que React (puerto 3000) pueda realizar peticiones sin bloqueos de navegador.
 */
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class GastoController {

    @Autowired
    private GastoService gastoService;

    /**
     * Corregido: Ahora devuelve un JSON en lugar de String simple.
     * Esto evita errores de parseo en el 'handleResponse' de tu api.ts.
     */
    @PostMapping
    public ResponseEntity<?> guardarGasto(@Valid @RequestBody Gasto gasto) {
        try {
            String mensaje = gastoService.guardarGasto(gasto);
            // Devolvemos un objeto JSON real: { "message": "Registro exitoso" }
            return ResponseEntity.ok(Map.of("message", mensaje));
        } catch (IllegalArgumentException e) {
            // Devolvemos un objeto JSON de error: { "error": "motivo del fallo" }
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // Captura cualquier otro error inesperado para evitar cortes de conexión
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor"));
        }
    }

    @GetMapping("/ultimos")
    public ResponseEntity<List<Gasto>> obtenerUltimosTresGastos() {
        return ResponseEntity.ok(gastoService.obtenerUltimosTresGastos());
    }

    @GetMapping("/balance")
    public ResponseEntity<Double> obtenerBalanceTotal() {
        return ResponseEntity.ok(gastoService.obtenerBalanceTotal());
    }

    @GetMapping("/historial")
    public ResponseEntity<List<TransaccionDTO>> obtenerHistorialTransacciones() {
        // Método optimizado para evitar errores 403 al no requerir cuerpo en el GET
        List<TransaccionDTO> historial = gastoService.obtenerHistorialTransaccionesCompleto();
        return ResponseEntity.ok(historial);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editarGasto(@PathVariable Long id, @RequestBody Gasto datos) {
        try {
            return ResponseEntity.ok(gastoService.editarGasto(id, datos));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarGasto(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(gastoService.eliminarGasto(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}