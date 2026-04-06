import { Ingreso, Gasto, TransaccionDTO } from '../types/types';

// Usuario demo
export const USUARIO_DEMO = 'demo@gamezone.com';

// Mock de Ingresos
export const mockIngresos: Ingreso[] = [
  {
    id: 1,
    monto: 2500.00,
    fecha: '2026-04-01',
    descripcion: 'Salario Mensual',
    usuarioEmail: USUARIO_DEMO,
  },
  {
    id: 2,
    monto: 500.00,
    fecha: '2026-04-03',
    descripcion: 'Freelance - Proyecto Web',
    usuarioEmail: USUARIO_DEMO,
  },
  {
    id: 3,
    monto: 150.00,
    fecha: '2026-04-05',
    descripcion: 'Venta de artículos usados',
    usuarioEmail: USUARIO_DEMO,
  },
];

// Mock de Gastos
export const mockGastos: Gasto[] = [
  {
    id: 1,
    monto: 85.50,
    categoria: 'Alimentación',
    fecha: '2026-04-02',
    descripcion: 'Compra de supermercado',
    usuarioEmail: USUARIO_DEMO,
  },
  {
    id: 2,
    monto: 45.00,
    categoria: 'Transporte',
    fecha: '2026-04-02',
    descripcion: 'Gasolina',
    usuarioEmail: USUARIO_DEMO,
  },
  {
    id: 3,
    monto: 120.00,
    categoria: 'Entretenimiento',
    fecha: '2026-04-04',
    descripcion: 'Cine y cena',
    usuarioEmail: USUARIO_DEMO,
  },
  {
    id: 4,
    monto: 200.00,
    categoria: 'Salud',
    fecha: '2026-04-05',
    descripcion: 'Consulta médica',
    usuarioEmail: USUARIO_DEMO,
  },
  {
    id: 5,
    monto: 60.00,
    categoria: 'Alimentación',
    fecha: '2026-04-06',
    descripcion: 'Restaurante',
    usuarioEmail: USUARIO_DEMO,
  },
];

// Función para convertir a TransaccionDTO y ordenar por fecha (más reciente primero)
export function obtenerHistorialTransacciones(): TransaccionDTO[] {
  const transacciones: TransaccionDTO[] = [];

  // Convertir ingresos
  mockIngresos.forEach(ingreso => {
    transacciones.push({
      id: ingreso.id,
      monto: ingreso.monto,
      fecha: ingreso.fecha,
      descripcion: ingreso.descripcion,
      tipo: 'INGRESO',
    });
  });

  // Convertir gastos
  mockGastos.forEach(gasto => {
    transacciones.push({
      id: gasto.id + 100, // offset para evitar conflicto de IDs
      monto: gasto.monto,
      fecha: gasto.fecha,
      descripcion: gasto.descripcion,
      categoria: gasto.categoria,
      tipo: 'GASTO',
    });
  });

  // Ordenar por fecha descendente (más reciente primero)
  return transacciones.sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

// Calcular balance general
export function calcularBalance(): {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
} {
  const totalIngresos = mockIngresos.reduce((sum, ing) => sum + ing.monto, 0);
  const totalGastos = mockGastos.reduce((sum, gst) => sum + gst.monto, 0);
  
  return {
    totalIngresos,
    totalGastos,
    balance: totalIngresos - totalGastos,
  };
}
