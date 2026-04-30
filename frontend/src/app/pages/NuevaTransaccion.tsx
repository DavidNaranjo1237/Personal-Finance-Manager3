import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ChevronRight, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { saveGasto, saveIngreso } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { CategoriaGasto, MetodoPago } from '../types/types';
import { METODOS_PAGO } from '../constants/paymentMethods';

type TipoMovimiento = 'GASTO' | 'INGRESO';

const CATEGORIAS: CategoriaGasto[] = [
  'Alimentación',
  'Transporte',
  'Salud',
  'Entretenimiento',
  'Educación',
  'Otros',
];

function formatearMontoVista(monto: string): string {
  const parsed = Number(monto);
  return Number.isFinite(parsed)
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(parsed)
    : '$0.00';
}

export default function NuevaTransaccion() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState<TipoMovimiento>('GASTO');
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState<MetodoPago | ''>('');
  const [categoria, setCategoria] = useState<CategoriaGasto | ''>('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);

  const montoVisible = useMemo(() => formatearMontoVista(monto), [monto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');

    if (!token || !userEmail) {
      toast.error('Sesión inválida o expirada');
      navigate('/');
      return;
    }

    const montoNum = Number(monto);
    if (!monto || !Number.isFinite(montoNum) || montoNum <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaSeleccionada > hoy) {
      toast.error('La fecha no puede ser futura');
      return;
    }

    if (!metodoPago) {
      toast.error('Debes seleccionar un método de pago');
      return;
    }

    if (!descripcion.trim()) {
      toast.error('La descripción es obligatoria');
      return;
    }

    if (tipo === 'GASTO' && !categoria) {
      toast.error('Debes seleccionar una categoría');
      return;
    }

    try {
      setGuardando(true);
      if (tipo === 'INGRESO') {
        await saveIngreso(
          {
            monto: montoNum,
            fecha,
            descripcion: descripcion.trim(),
            metodoPago,
            usuarioEmail: userEmail,
          },
          token
        );
      } else {
        await saveGasto(
          {
            monto: montoNum,
            fecha,
            descripcion: descripcion.trim(),
            categoria,
            metodoPago,
          },
          token
        );
      }

      toast.success('Transacción guardada correctamente');
      navigate('/historial');
    } catch (error: any) {
      toast.error('Error al guardar la transacción', {
        description: error?.message || 'Verifica que el backend esté activo',
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="mx-auto w-full max-auto space-y-6 rounded-2xl bg-slate-950 px-5 py-6 text-slate-100">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-300 hover:bg-slate-800 hover:text-white"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Nueva Transacción</h1>
        <div className="size-9" />
      </div>

      <div className="pt-2 text-center">
        <p className="text-6xl font-bold tracking-tight text-slate-300">{montoVisible}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl bg-slate-800 p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setTipo('GASTO')}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                tipo === 'GASTO' ? 'bg-slate-700 text-white' : 'text-slate-400'
              }`}
            >
              Gastos
            </button>
            <button
              type="button"
              onClick={() => setTipo('INGRESO')}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                tipo === 'INGRESO' ? 'bg-slate-700 text-white' : 'text-slate-400'
              }`}
            >
              Ingresos
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Monto *</Label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="0.00"
            className="border-slate-700 bg-slate-900 text-slate-100"
            disabled={guardando}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Método de pago *</Label>
          <div className="grid grid-cols-2 gap-3">
            {METODOS_PAGO.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setMetodoPago(value)}
                className={`rounded-2xl border p-3 text-left transition ${
                  metodoPago === value
                    ? 'border-indigo-400 bg-indigo-500/20 text-white'
                    : 'border-slate-700 bg-slate-900 text-slate-300'
                }`}
              >
                <Icon className="mb-2 size-5" />
                <p className="text-sm">{label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-slate-300">
                <CalendarDays className="size-4" />
                Fecha
              </span>
              <Input
                type="date"
                value={fecha}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFecha(e.target.value)}
                className="w-auto border-none bg-transparent p-0 text-slate-200"
                disabled={guardando}
              />
            </div>
          </div>

          {tipo === 'GASTO' && (
            <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-slate-300">
                  <Tag className="size-4" />
                  Categoría
                </span>
                <div className="flex items-center gap-2">
                  <Select
                    value={categoria}
                    onValueChange={(value: CategoriaGasto) => setCategoria(value)}
                    disabled={guardando}
                  >
                    <SelectTrigger className="w-52 border-none bg-transparent text-slate-200 shadow-none">
                      <SelectValue placeholder="Seleccione Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ChevronRight className="size-4 text-slate-500" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Descripción *</Label>
          <Textarea
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Escribe un detalle de la transacción"
            className="border-slate-700 bg-slate-900 text-slate-100"
            disabled={guardando}
          />
        </div>

        <Button
          type="submit"
          className="h-12 w-full bg-indigo-600 text-base font-semibold hover:bg-indigo-700"
          disabled={guardando}
        >
          {guardando ? 'Guardando...' : 'Guardar Transacción'}
        </Button>
      </form>
    </div>
  );
}
