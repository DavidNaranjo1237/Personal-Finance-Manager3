import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, TrendingDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CategoriaGasto, MetodoPago } from '../types/types';
import { saveGasto } from '../api'; 
import { METODOS_PAGO } from '../constants/paymentMethods';

const CATEGORIAS: CategoriaGasto[] = [
  'Alimentación',
  'Transporte',
  'Salud',
  'Entretenimiento',
  'Educación',
  'Otros',
];

export default function NuevoGasto() {
  const navigate = useNavigate();
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState<string>('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  const [metodoPago, setMetodoPago] = useState<MetodoPago | ''>('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const montoNum = parseFloat(monto);

    // 🔴 Validación monto
    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    // 🔴 Validación categoría
    if (!categoria) {
      toast.error('Debes seleccionar una categoría');
      return;
    }

    // 🔴 Validación fecha (extra)
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

    // 🔴 Validación sesión (CLAVE)
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

    try {
      await saveGasto(nuevoGasto, token); 

      toast.success('Gasto registrado', {
        description: `${categoria}: ${new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(montoNum)}`,
      });

      // 🔁 Redirección más rápida
      setTimeout(() => navigate('/dashboard'), 800);

    } catch (error: any) {
      console.error("Error al conectar con el servidor:", error);

      toast.error('Error al guardar el gasto', {
        description: error?.message || 'Verifica que el backend esté activo',
      });

    } finally {
      setEnviando(false);
    }
  };

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

      <Card className="shadow-sm border-red-100">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingDown className="size-6 text-red-600" />
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

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>

              <Select value={categoria} onValueChange={setCategoria} disabled={enviando}>
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>

                <SelectContent>
                  {CATEGORIAS.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                className="flex-1 bg-red-600 hover:bg-red-700"
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