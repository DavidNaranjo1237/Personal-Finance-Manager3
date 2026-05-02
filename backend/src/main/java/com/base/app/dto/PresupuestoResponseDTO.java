package com.base.app.dto;

import java.time.YearMonth;

public class PresupuestoResponseDTO {

    private Long id;
    private Double limite;
    private Double gastado;
    private Double disponible;
    private Double porcentaje;
    private String estado;
    private String alerta;
    private String categoria;
    private YearMonth mes;

    public PresupuestoResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getLimite() { return limite; }
    public void setLimite(Double limite) { this.limite = limite; }

    public Double getGastado() { return gastado; }
    public void setGastado(Double gastado) { this.gastado = gastado; }

    public Double getDisponible() { return disponible; }
    public void setDisponible(Double disponible) { this.disponible = disponible; }

    public Double getPorcentaje() { return porcentaje; }
    public void setPorcentaje(Double porcentaje) { this.porcentaje = porcentaje; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getAlerta() { return alerta; }
    public void setAlerta(String alerta) { this.alerta = alerta; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public YearMonth getMes() { return mes; }
    public void setMes(YearMonth mes) { this.mes = mes; }
}