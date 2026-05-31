package com.base.app.service;

import com.base.app.dto.MetaAhorroResponseDTO;
import com.base.app.model.MetaAhorro;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MetaAhorroService {

    private final List<MetaAhorro> metas = new ArrayList<>();
    private Long contadorId = 1L;

    private MetaAhorroResponseDTO toDTO(MetaAhorro meta) {
        double porcentajeAvance = meta.getMontoObjetivo() > 0
                ? (meta.getMontoActual() / meta.getMontoObjetivo()) * 100 : 0;
        double montoRestante = meta.getMontoObjetivo() - meta.getMontoActual();
        String estado = meta.getMontoActual() >= meta.getMontoObjetivo()
                ? "COMPLETADA" : "ACTIVA";
        meta.setEstado(estado);

        return new MetaAhorroResponseDTO(
                meta.getId(),
                meta.getNombre(),
                meta.getMontoObjetivo(),
                meta.getMontoActual(),
                Math.max(montoRestante, 0),
                Math.min(porcentajeAvance, 100),
                estado
        );
    }

    public MetaAhorroResponseDTO crear(MetaAhorro meta) {
        if (meta.getNombre() == null || meta.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (meta.getMontoObjetivo() == null || meta.getMontoObjetivo() <= 0) {
            throw new IllegalArgumentException("El monto objetivo debe ser mayor a 0");
        }
        if (meta.getMontoActual() == null || meta.getMontoActual() < 0) {
            throw new IllegalArgumentException("El monto actual no puede ser negativo");
        }
        if (meta.getFechaLimite() == null) {
            throw new IllegalArgumentException("La fecha límite es obligatoria");
        }
        meta.setId(contadorId++);
        meta.setEstado("ACTIVA");
        metas.add(meta);
        return toDTO(meta);
    }

    public List<MetaAhorroResponseDTO> listar() {
        return metas.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MetaAhorroResponseDTO obtenerPorId(Long id) {
        return metas.stream()
                .filter(m -> m.getId().equals(id))
                .findFirst()
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Meta no encontrada con id: " + id));
    }

    public MetaAhorroResponseDTO editar(Long id, MetaAhorro datos) {
        MetaAhorro meta = metas.stream()
                .filter(m -> m.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Meta no encontrada con id: " + id));

        if (datos.getNombre() != null && !datos.getNombre().isBlank()) {
            meta.setNombre(datos.getNombre());
        }
        if (datos.getMontoObjetivo() != null && datos.getMontoObjetivo() > 0) {
            meta.setMontoObjetivo(datos.getMontoObjetivo());
        }
        if (datos.getMontoActual() != null && datos.getMontoActual() >= 0) {
            meta.setMontoActual(datos.getMontoActual());
        }
        if (datos.getFechaLimite() != null) {
            meta.setFechaLimite(datos.getFechaLimite());
        }
        return toDTO(meta);
    }

    public void eliminar(Long id) {
        boolean removed = metas.removeIf(m -> m.getId().equals(id));
        if (!removed) {
            throw new RuntimeException("Meta no encontrada con id: " + id);
        }
    }
}