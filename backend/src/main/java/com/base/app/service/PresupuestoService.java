package com.base.app.service;

import com.base.app.dto.PresupuestoResponseDTO;
import com.base.app.model.Presupuesto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PresupuestoService {

    @Autowired
    private GastoService gastoService;

    private final List<Presupuesto> presupuestos = new ArrayList<>();

    public String guardarPresupuesto(Presupuesto presupuesto) {
        if (presupuesto.getLimite() == null || presupuesto.getLimite() <= 0) {
            throw new IllegalArgumentException("El límite debe ser mayor a cero.");
        }

        presupuesto.setMes(YearMonth.now());
        presupuesto.setUsuarioId(1L);

        presupuestos.removeIf(p ->
            p.getMes().equals(presupuesto.getMes()) &&
            p.getUsuarioId().equals(presupuesto.getUsuarioId()) &&
            categoriasIguales(p.getCategoria(), presupuesto.getCategoria())
        );

        presupuesto.setId((long) (presupuestos.size() + 1));
        presupuestos.add(presupuesto);

        return "Presupuesto registrado correctamente";
    }

    public List<PresupuestoResponseDTO> obtenerEstadoPresupuestos() {
        YearMonth mesActual = YearMonth.now();
        return presupuestos.stream()
                .filter(p -> p.getMes().equals(mesActual))
                .map(p -> construirDTO(p))
                .collect(Collectors.toList());
    }

    private PresupuestoResponseDTO construirDTO(Presupuesto p) {
        double gastado = gastoService.obtenerGastosMes(p.getMes(), p.getCategoria());
        double porcentaje = (gastado / p.getLimite()) * 100;
        double disponible = p.getLimite() - gastado;

        String estado;
        String alerta;

        if (porcentaje >= 100) {
            estado = "EXCEDIDO";
            alerta = "⚠️ Has superado tu límite" +
                    (p.getCategoria() != null ? " de " + p.getCategoria() : "") +
                    ". Gastado: $" + String.format("%.2f", gastado) +
                    " de $" + String.format("%.2f", p.getLimite());
        } else if (porcentaje >= 80) {
            estado = "CERCANO_AL_LIMITE";
            alerta = "🔔 Has gastado el " + String.format("%.0f", porcentaje) + "% de tu presupuesto" +
                    (p.getCategoria() != null ? " de " + p.getCategoria() : "");
        } else {
            estado = "NORMAL";
            alerta = null;
        }

        PresupuestoResponseDTO dto = new PresupuestoResponseDTO();
        dto.setId(p.getId());
        dto.setLimite(p.getLimite());
        dto.setGastado(gastado);
        dto.setDisponible(disponible);
        dto.setPorcentaje(Math.min(porcentaje, 100));
        dto.setEstado(estado);
        dto.setAlerta(alerta);
        dto.setCategoria(p.getCategoria());
        dto.setMes(p.getMes());
        return dto;
    }

    private boolean categoriasIguales(String c1, String c2) {
        if (c1 == null && c2 == null) return true;
        if (c1 == null || c2 == null) return false;
        return c1.equalsIgnoreCase(c2);
    }
}