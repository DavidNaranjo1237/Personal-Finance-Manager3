package com.base.app.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.YearMonth;

public class Presupuesto {

    private Long id;

    @NotNull(message = "El límite es obligatorio.")
    @Positive(message = "El límite debe ser mayor a cero.")
    private Double limite;

    private String categoria;

    private YearMonth mes;

    private Long usuarioId;

    public Presupuesto() {}

    public Presupuesto(Long id, Double limite, String categoria, YearMonth mes, Long usuarioId) {
        this.id = id;
        this.limite = limite;
        this.categoria = categoria;
        this.mes = mes;
        this.usuarioId = usuarioId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getLimite() { return limite; }
    public void setLimite(Double limite) { this.limite = limite; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public YearMonth getMes() { return mes; }
    public void setMes(YearMonth mes) { this.mes = mes; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}