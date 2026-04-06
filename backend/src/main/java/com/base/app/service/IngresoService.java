package com.base.app.service;

import com.base.app.model.Ingreso;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class IngresoService {

    private final List<Ingreso> ingresos = new ArrayList<>();

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

        // Guardar ingreso
        ingresos.add(ingreso);
        return "Registro guardado correctamente";
    }

    public List<Ingreso> obtenerIngresos() {
        return ingresos;
    }
}