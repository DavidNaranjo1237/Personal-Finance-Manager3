import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, TrendingDown, Loader2, AlertTriangle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { CategoriaGasto, MetodoPago } from '../types/types';
import { saveGasto } from '../api';
import { METODOS_PAGO } from '../constants/paymentMethods';

//  Tipos locales para presupuesto 
type BudgetType = 'global' | 'category';

type SavedBudget = {
  month: string;
  type: BudgetType;
  category: string;
  limit: number;
};

type AlertStatus = 'none' | 'warning' | 'exceeded';

// Constantes 
const CATEGORIAS: CategoriaGasto[] = [
  'Alimentación',
  'Transporte',
  'Salud',
  'Entretenimiento',
  'Educación',
  'Otros',
];

// Helpers 

/** Normaliza un string para comparación sin tildes ni mayúsculas */
const normalizar = (str: string) =>
  str
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/**
 * Calcula el gasto acumulado en el localStorage para una categoría dada.
 * Si el presupuesto es global, suma todos los gastos.
 */
const calcularGastoAcumulado = (
  gastos: any[],
  budget: SavedBudget,
  categoria: string
): number => {
  if (budget.type === 'global') {
    return gastos.reduce((acc, g) => acc + Number(g.monto || 0), 0);
  }
  return gastos
    .filter((g) => normalizar(g.categoria || '') === normalizar(categoria))
    .reduce((acc, g) => acc + Number(g.monto || 0), 0);
};

/**
 * Determina el estado de alerta dado el porcentaje consumido.
 */
const calcularStatus = (porcentaje: number): AlertStatus => {
  if (porcentaje > 100) return 'exceeded';
  if (porcentaje >= 80) return 'warning';
  return 'none';
};

//  Componente de alerta inline 
interface AlertaPresupuestoProps {
  status: AlertStatus;
  porcentaje: number;
  limite: number;
  gastoAcumulado: number;
  nuevoMonto: number;
  categoria: string;
}

function AlertaPresupuesto({
  status,
  porcentaje,
  limite,
  gastoAcumulado,
  nuevoMonto,
  categoria,
}: AlertaPresupuestoProps) {
  if (status === 'none') return null;

  const exceso = gastoAcumulado + nuevoMonto - limite;

  const esExcedido = status === 'exceeded';

  const containerClasses = esExcedido
    ? 'border border-red-200 bg-red-50 text-red-700'
    : 'border border-amber-200 bg-amber-50 text-amber-700';

  const IconComponent = esExcedido ? AlertCircle : AlertTriangle;

  return (
    <div className={`rounded-xl p-4 flex items-start gap-3 ${containerClasses}`}>
      <IconComponent className="mt-0.5 size-5 shrink-0" />
      <div className="space-y-0.5">
        <p className="text-sm font-semibold">
          {esExcedido
            ? 'Límite de presupuesto excedido'
            : 'Cerca del límite de presupuesto'}
        </p>
        <p className="text-sm">
          {esExcedido
            ? `Al guardar este gasto superarás el presupuesto de "${categoria}" por ${new Intl.NumberFormat(
                'es-MX',
                { style: 'currency', currency: 'MXN' }
              ).format(exceso)}.`
            : `Al guardar este gasto habrás consumido el ${porcentaje.toFixed(
                0
              )}% del presupuesto de "${categoria}". Quedarán ${new Intl.NumberFormat(
                'es-MX',
                { style: 'currency', currency: 'MXN' }
              ).format(limite - (gastoAcumulado + nuevoMonto))}.`}
        </p>
      </div>
    </div>
  );
}

//  Página principal 
export default function NuevoGasto() {
  const navigate = useNavigate();

  // Estado del formulario (sin cambios) 
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState<string>('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  const [metodoPago, setMetodoPago] = useState<MetodoPago | ''>('');
  const [enviando, setEnviando] = useState(false);

  //  Estado de presupuesto (NUEVO) 
  const [savedBudget, setSavedBudget] = useState<SavedBudget | null>(null);
  const [gastosLocales, setGastosLocales] = useState<any[]>([]);

  // Cargar presupuesto y gastos desde localStorage al montar (NUEVO)
  useEffect(() => {
    const presupuestoGuardado = localStorage.getItem('presupuesto');
    if (presupuestoGuardado) {
      setSavedBudget(JSON.parse(presupuestoGuardado));
    }

    const gastosGuardados = JSON.parse(localStorage.getItem('gastos') || '[]');
    setGastosLocales(gastosGuardados);
  }, []);

  // Cálculo reactivo de alerta (NUEVO) 
  const alertaInfo = useMemo(() => {
    const montoNum = parseFloat(monto);

    // Sin presupuesto configurado o datos incompletos → sin alerta
    if (!savedBudget || !categoria || isNaN(montoNum) || montoNum <= 0) {
      return { status: 'none' as AlertStatus, porcentaje: 0, gastoAcumulado: 0 };
    }

    // El presupuesto por categoría solo aplica si la categoría coincide
    if (
      savedBudget.type === 'category' &&
      normalizar(savedBudget.category) !== normalizar(categoria)
    ) {
      return { status: 'none' as AlertStatus, porcentaje: 0, gastoAcumulado: 0 };
    }

    const gastoAcumulado = calcularGastoAcumulado(gastosLocales, savedBudget, categoria);
    const totalConNuevo = gastoAcumulado + montoNum;
    const porcentaje = (totalConNuevo / savedBudget.limit) * 100;
    const status = calcularStatus(porcentaje);

    return { status, porcentaje, gastoAcumulado };
  }, [monto, categoria, savedBudget, gastosLocales]);

  // Submit (estructura idéntica, solo se agregan los toasts diferenciados)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const montoNum = parseFloat(monto);

    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    if (!categoria) {
      toast.error('Debes seleccionar una categoría');
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

    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');

    if (!token || !userEmail) {
      toast.error('Sesión inválida o expirada');
      navigate('/');
      return;
    }

    const nuevoGasto = {
      monto: montoNum,
      categoria,
      fecha,
      descripcion,
      metodoPago,
    };

    setEnviando(true);
    console.log('ENVIANDO GASTO:', nuevoGasto);

    // Helper para disparar el toast correcto según alerta (NUEVO) 
    const mostrarToastResultado = (esLocal = false) => {
      const descripcionMonto = `${categoria}: ${new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(montoNum)}`;

      const sufijo = esLocal ? ' (guardado localmente)' : '';

      if (alertaInfo.status === 'exceeded') {
        toast.error(`⚠️ Presupuesto excedido${sufijo}`, {
          description: `${descripcionMonto} — Has superado el límite de presupuesto configurado.`,
        });
      } else if (alertaInfo.status === 'warning') {
        toast.warning(`Gasto registrado${sufijo}`, {
          description: `${descripcionMonto} — Has alcanzado el ${alertaInfo.porcentaje.toFixed(0)}% de tu presupuesto.`,
        });
      } else {
        toast.success(`Gasto registrado${sufijo}`, {
          description: descripcionMonto,
        });
      }
    };

    try {
      await saveGasto(nuevoGasto, token);

      // Persistencia MVP en localStorage (sin cambios)
      const gastosLocales = JSON.parse(localStorage.getItem('gastos') || '[]');
      gastosLocales.push({ ...nuevoGasto, id: Date.now() });
      localStorage.setItem('gastos', JSON.stringify(gastosLocales));
      localStorage.setItem('updatePresupuesto', 'true');

      mostrarToastResultado(false); // NUEVO: toast diferenciado

      setTimeout(() => navigate('/dashboard'), 800);
    } catch (error: any) {
      console.error('Error al conectar con el servidor:', error);

      // Fallback MVP (sin cambios)
      const gastosLocales = JSON.parse(localStorage.getItem('gastos') || '[]');
      gastosLocales.push({ ...nuevoGasto, id: Date.now() });
      localStorage.setItem('gastos', JSON.stringify(gastosLocales));
      localStorage.setItem('updatePresupuesto', 'true');

      mostrarToastResultado(true); // NUEVO: toast diferenciado con sufijo local

      setTimeout(() => navigate('/dashboard'), 800);
    } finally {
      setEnviando(false);
    }
  };

  // JSX (estructura idéntica + AlertaPresupuesto entre monto y categoría)
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          disabled={enviando}
        >
          <ArrowLeft className="size-5" />
        </Button>

        <div>
          <h2 className="text-2xl font-bold">Registrar Gasto</h2>
          <p className="text-sm text-gray-500">
            Añade un nuevo egreso a tu cuenta
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-[--border]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-secondary flex items-center justify-center">
              <TrendingDown className="size-6 text-primary" />
            </div>

            <div>
              <CardTitle>Detalles del Gasto</CardTitle>
              <CardDescription>
                Ingresa la información para actualizar tu balance
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Monto — sin cambios */}
            <div className="space-y-2">
              <Label htmlFor="monto">Monto *</Label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>

                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="pl-7"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  required
                  disabled={enviando}
                />
              </div>
            </div>

            {/*  ALERTA INLINE (NUEVO) — aparece entre monto y categoría */}
            {alertaInfo.status !== 'none' && savedBudget && (
              <AlertaPresupuesto
                status={alertaInfo.status}
                porcentaje={alertaInfo.porcentaje}
                limite={savedBudget.limit}
                gastoAcumulado={alertaInfo.gastoAcumulado}
                nuevoMonto={parseFloat(monto) || 0}
                categoria={
                  savedBudget.type === 'global' ? 'todos los gastos' : categoria
                }
              />
            )}

            {/* Categoría — sin cambios */}
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>

              <Select value={categoria} onValueChange={setCategoria} disabled={enviando}>
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>

                <SelectContent>
                  {CATEGORIAS.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fecha — sin cambios */}
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>

              <Input
                id="fecha"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                disabled={enviando}
              />
            </div>

            {/* Método de pago — sin cambios */}
            <div className="space-y-2">
              <Label htmlFor="metodoPago">Método de Pago *</Label>

              <Select
                value={metodoPago}
                onValueChange={(value: MetodoPago) => setMetodoPago(value)}
                disabled={enviando}
              >
                <SelectTrigger id="metodoPago">
                  <SelectValue placeholder="Selecciona un método de pago" />
                </SelectTrigger>

                <SelectContent>
                  {METODOS_PAGO.map((metodo) => (
                    <SelectItem key={metodo.value} value={metodo.value}>
                      {metodo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descripción — sin cambios */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>

              <Textarea
                id="descripcion"
                placeholder="¿En qué gastaste este dinero?"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                disabled={enviando}
              />
            </div>

            {/* Botones — sin cambios */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/dashboard')}
                disabled={enviando}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={enviando}
              >
                {enviando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Gasto'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}