// Tipos basados en el modelo del Backend Spring Boot

export interface Ingreso {
  id: number;
  monto: number;
  fecha: string;
  descripcion: string;
  metodoPago: MetodoPago;
  usuarioEmail: string;
}

export interface Gasto {
  id: number;
  monto: number;
  categoria: string;
  fecha: string;
  descripcion: string;
  metodoPago: MetodoPago;
  usuarioEmail: string;
}

export interface TransaccionDTO {
  id: number;
  monto: number;
  fecha: string;
  descripcion: string;
  categoria?: string; // Solo presente en gastos
  metodoPago?: MetodoPago;
  tipo: 'INGRESO' | 'GASTO';
}

export type MetodoPago =
  | 'CUENTA_BANCARIA'
  | 'EFECTIVO'
  | 'TARJETA_CREDITO'
  | 'OTRO';

export type CategoriaGasto = 
  | 'Alimentación'
  | 'Transporte'
  | 'Salud'
  | 'Entretenimiento'
  | 'Educación'
  | 'Otros';
