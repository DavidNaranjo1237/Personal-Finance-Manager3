package com.base.app.service;

import com.base.app.model.Ingreso;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class IngresoService {

    private final List<Ingreso> ingresos = new ArrayList<>();
    private Long contadorId = 1L;

    public String guardarIngreso(Ingreso ingreso) {
        // Validar monto
        if (ingreso.getMonto() == null || ingreso.getMonto() <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a cero.");
        }

        // Validar fecha
        if (ingreso.getFecha() == null || ingreso.getFecha().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha no puede ser futura.");
        }

        // Asociar al usuario demo
        ingreso.setDescripcion("Asociado al usuario demo@gamezone.com");

        // HU07: Asignar id antes de guardar
        ingreso.setId(contadorId++);

        // Guardar ingreso
        ingresos.add(ingreso);
        return "Registro guardado correctamente";
    }

    public List<Ingreso> obtenerIngresos() {
        return ingresos;
    }

    // HU07: Editar ingreso por id
    public Map<String, String> editarIngreso(Long id, Ingreso datos) {
        Ingreso ingreso = ingresos.stream()
                .filter(i -> i.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Ingreso no encontrado con id: " + id));

        if (datos.getMonto() != null && datos.getMonto() > 0) {
            ingreso.setMonto(datos.getMonto());
        }
        if (datos.getFecha() != null) {
            ingreso.setFecha(datos.getFecha());
        }
        if (datos.getDescripcion() != null) {
            ingreso.setDescripcion(datos.getDescripcion());
        }
        if (datos.getMetodoPago() != null) {
            ingreso.setMetodoPago(datos.getMetodoPago());
        }

        return Map.of("mensaje", "Ingreso actualizado correctamente");
    }

    // HU07: Eliminar ingreso por id
    public Map<String, String> eliminarIngreso(Long id) {
        boolean removed = ingresos.removeIf(i -> i.getId().equals(id));
        if (!removed) {
            throw new RuntimeException("Ingreso no encontrado con id: " + id);
        }
        return Map.of("mensaje", "Ingreso eliminado correctamente");
    }
}