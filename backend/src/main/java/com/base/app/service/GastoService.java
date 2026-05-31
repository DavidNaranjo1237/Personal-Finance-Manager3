package com.base.app.service;

import com.base.app.model.Gasto;
import com.base.app.dto.TransaccionDTO;
import com.base.app.model.Ingreso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GastoService {

    @Autowired
    private IngresoService ingresoService;

    private final List<Gasto> gastos = new ArrayList<>();

    public double obtenerBalanceTotal() {
        double totalIngresos = ingresoService.obtenerIngresos().stream()
                .mapToDouble(Ingreso::getMonto)
                .sum();

        double totalGastos = gastos.stream()
                .mapToDouble(Gasto::getMonto)
                .sum();

        return totalIngresos - totalGastos;
    }

    public String guardarGasto(Gasto gasto) {
        if (gasto.getMonto() == null || gasto.getMonto() <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a cero.");
        }
        if (gasto.getFecha() == null || gasto.getFecha().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha no puede ser futura.");
        }
        gasto.setId((long) (gastos.size() + 1));
        gasto.setUsuarioId(1L);
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

        transacciones.addAll(ingresos.stream().map(ingreso -> {
            TransaccionDTO dto = new TransaccionDTO();
            dto.setId(ingreso.getId());
            dto.setMonto(ingreso.getMonto());
            dto.setFecha(ingreso.getFecha());
            dto.setDescripcion(ingreso.getDescripcion());
            dto.setMetodoPago(ingreso.getMetodoPago());
            dto.setTipo("INGRESO");
            return dto;
        }).collect(Collectors.toList()));

        transacciones.addAll(gastos.stream().map(gasto -> {
            TransaccionDTO dto = new TransaccionDTO();
            dto.setId(gasto.getId());
            dto.setMonto(gasto.getMonto());
            dto.setFecha(gasto.getFecha());
            dto.setDescripcion(gasto.getDescripcion());
            dto.setCategoria(gasto.getCategoria());
            dto.setMetodoPago(gasto.getMetodoPago());
            dto.setTipo("GASTO");
            return dto;
        }).collect(Collectors.toList()));

        transacciones.sort((t1, t2) -> t2.getFecha().compareTo(t1.getFecha()));
        return transacciones;
    }

    public double obtenerGastosMes(YearMonth mes, String categoria) {
        return gastos.stream()
                .filter(g -> YearMonth.from(g.getFecha()).equals(mes))
                .filter(g -> categoria == null || categoria.equalsIgnoreCase(g.getCategoria()))
                .mapToDouble(Gasto::getMonto)
                .sum();
    }

    // HU07: Editar gasto por id
    public Map<String, String> editarGasto(Long id, Gasto datos) {
        Gasto gasto = gastos.stream()
                .filter(g -> g.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Gasto no encontrado con id: " + id));

        if (datos.getMonto() != null && datos.getMonto() > 0) {
            gasto.setMonto(datos.getMonto());
        }
        if (datos.getCategoria() != null && !datos.getCategoria().isBlank()) {
            gasto.setCategoria(datos.getCategoria());
        }
        if (datos.getFecha() != null) {
            gasto.setFecha(datos.getFecha());
        }
        if (datos.getDescripcion() != null) {
            gasto.setDescripcion(datos.getDescripcion());
        }
        if (datos.getMetodoPago() != null) {
            gasto.setMetodoPago(datos.getMetodoPago());
        }
        return Map.of("mensaje", "Gasto actualizado correctamente");
    }

    // HU07: Eliminar gasto por id
    public Map<String, String> eliminarGasto(Long id) {
        boolean removed = gastos.removeIf(g -> g.getId().equals(id));
        if (!removed) {
            throw new RuntimeException("Gasto no encontrado con id: " + id);
        }
        return Map.of("mensaje", "Gasto eliminado correctamente");
    }

    // HU08: Total gastado por categoria (usado por PresupuestoService)
    public Double getTotalPorCategoria(String categoria) {
        return gastos.stream()
                .filter(g -> g.getCategoria() != null &&
                             g.getCategoria().equalsIgnoreCase(categoria))
                .mapToDouble(g -> g.getMonto() != null ? g.getMonto() : 0)
                .sum();
    }
}