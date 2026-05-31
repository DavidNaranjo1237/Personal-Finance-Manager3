package com.base.app.dto;

public class AlertaPresupuestoDTO {

    private String categoria;
    private Double porcentajeConsumido;
    private Double disponible;
    private String alerta;

    public AlertaPresupuestoDTO() {}

    public AlertaPresupuestoDTO(String categoria, Double porcentajeConsumido,
                                Double disponible, String alerta) {
        this.categoria = categoria;
        this.porcentajeConsumido = porcentajeConsumido;
        this.disponible = disponible;
        this.alerta = alerta;
    }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Double getPorcentajeConsumido() { return porcentajeConsumido; }
    public void setPorcentajeConsumido(Double porcentajeConsumido) { this.porcentajeConsumido = porcentajeConsumido; }

    public Double getDisponible() { return disponible; }
    public void setDisponible(Double disponible) { this.disponible = disponible; }

    public String getAlerta() { return alerta; }
    public void setAlerta(String alerta) { this.alerta = alerta; }
}