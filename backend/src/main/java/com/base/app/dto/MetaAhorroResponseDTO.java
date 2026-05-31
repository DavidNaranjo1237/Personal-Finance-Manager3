package com.base.app.dto;

public class MetaAhorroResponseDTO {

    private Long id;
    private String nombre;
    private Double montoObjetivo;
    private Double montoActual;
    private Double montoRestante;
    private Double porcentajeAvance;
    private String estado;

    public MetaAhorroResponseDTO() {}

    public MetaAhorroResponseDTO(Long id, String nombre, Double montoObjetivo,
                                  Double montoActual, Double montoRestante,
                                  Double porcentajeAvance, String estado) {
        this.id = id;
        this.nombre = nombre;
        this.montoObjetivo = montoObjetivo;
        this.montoActual = montoActual;
        this.montoRestante = montoRestante;
        this.porcentajeAvance = porcentajeAvance;
        this.estado = estado;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Double getMontoObjetivo() { return montoObjetivo; }
    public void setMontoObjetivo(Double montoObjetivo) { this.montoObjetivo = montoObjetivo; }

    public Double getMontoActual() { return montoActual; }
    public void setMontoActual(Double montoActual) { this.montoActual = montoActual; }

    public Double getMontoRestante() { return montoRestante; }
    public void setMontoRestante(Double montoRestante) { this.montoRestante = montoRestante; }

    public Double getPorcentajeAvance() { return porcentajeAvance; }
    public void setPorcentajeAvance(Double porcentajeAvance) { this.porcentajeAvance = porcentajeAvance; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}