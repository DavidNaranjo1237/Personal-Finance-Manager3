import { Building2, CreditCard, Landmark, WalletCards } from 'lucide-react';
import { MetodoPago } from '../types/types';

export const METODOS_PAGO: Array<{
  value: MetodoPago;
  label: string;
  icon: typeof Landmark;
}> = [
  { value: 'CUENTA_BANCARIA', label: 'Cuenta Bancaria', icon: Landmark },
  { value: 'EFECTIVO', label: 'Efectivo', icon: WalletCards },
  { value: 'TARJETA_CREDITO', label: 'Tarjeta Crédito', icon: CreditCard },
  { value: 'OTRO', label: 'Otro', icon: Building2 },
];

export function metodoPagoLabel(value?: MetodoPago | string): string {
  const found = METODOS_PAGO.find((item) => item.value === value);
  return found?.label ?? 'No especificado';
}
