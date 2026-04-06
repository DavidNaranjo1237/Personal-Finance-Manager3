package com.base.app.service;

import com.base.app.model.Gasto;
import com.base.app.dto.TransaccionDTO;
import com.base.app.model.Ingreso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GastoService {

    @Autowired
    private IngresoService ingresoService;

    // Lista en memoria para persistencia temporal (mientras el Docker esté encendido)
    private final List<Gasto> gastos = new ArrayList<>();

    /**
     * MODIFICACIÓN: El balance ya no empieza en 1000. 
     * Se calcula dinámicamente para que sea $0.00 al iniciar.
     */
    public double obtenerBalanceTotal() {
        // Sumamos todos los ingresos actuales
        double totalIngresos = ingresoService.obtenerIngresos().stream()
                .mapToDouble(Ingreso::getMonto)
                .sum();

        // Sumamos todos los gastos guardados en la lista
        double totalGastos = gastos.stream()
                .mapToDouble(Gasto::getMonto)
                .sum();

        // El balance real es la diferencia
        return totalIngresos - totalGastos;
    }

    public String guardarGasto(Gasto gasto) {
        // Validaciones de seguridad
        if (gasto.getMonto() == null || gasto.getMonto() <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a cero.");
        }

        if (gasto.getFecha() == null || gasto.getFecha().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha no puede ser futura.");
        }

        // Generar ID manual basado en el tamaño de la lista
        gasto.setId((long) (gastos.size() + 1));

        // Asociar al usuario demo
        gasto.setUsuarioId(1L); 

        // Guardar en la lista (memoria del Docker)
        gastos.add(gasto);
        
        return "Registro exitoso";
    }

    public List<Gasto> obtenerUltimosTresGastos() {
        return gastos.stream()
                .sorted((g1, g2) -> g2.getFecha().compareTo(g1.getFecha()))
                .limit(3)
                .collect(Collectors.toList());
    }

    public List<TransaccionDTO> obtenerHistorialTransaccionesCompleto() {
        List<Ingreso> ingresos = ingresoService.obtenerIngresos();
        return obtenerHistorialTransacciones(ingresos);
    }

    public List<TransaccionDTO> obtenerHistorialTransacciones(List<Ingreso> ingresos) {
        List<TransaccionDTO> transacciones = new ArrayList<>();

        // Convertir ingresos a DTO
        transacciones.addAll(ingresos.stream().map(ingreso -> {
            TransaccionDTO dto = new TransaccionDTO();
            dto.setId(ingreso.getId());
            dto.setMonto(ingreso.getMonto());
            dto.setFecha(ingreso.getFecha());
            dto.setDescripcion(ingreso.getDescripcion());
            dto.setTipo("INGRESO");
            return dto;
        }).collect(Collectors.toList()));

        // Convertir gastos a DTO
        transacciones.addAll(gastos.stream().map(gasto -> {
            TransaccionDTO dto = new TransaccionDTO();
            dto.setId(gasto.getId());
            dto.setMonto(gasto.getMonto());
            dto.setFecha(gasto.getFecha());
            dto.setDescripcion(gasto.getDescripcion());
            dto.setCategoria(gasto.getCategoria());
            dto.setTipo("GASTO");
            return dto;
        }).collect(Collectors.toList()));

        // Ordenar historial por fecha (más reciente primero)
        transacciones.sort((t1, t2) -> t2.getFecha().compareTo(t1.getFecha()));

        return transacciones;
    }
}