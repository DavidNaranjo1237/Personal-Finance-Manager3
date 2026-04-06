import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, TrendingDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CategoriaGasto } from '../types/types';
// Importamos la función de conexión real
import { saveGasto } from '../api'; 

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
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validaciones de Frontend
    const montoNum = parseFloat(monto);
    if (montoNum <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    if (!categoria) {
      toast.error('Debes seleccionar una categoría');
      return;
    }

    // 2. Preparar el objeto para el Backend (Gasto.java)
    const nuevoGasto = {
      monto: montoNum,
      categoria,
      fecha,
      descripcion
    };

    setEnviando(true);

    try {
      const token = localStorage.getItem('token') || "";
      
      // 3. Llamada real al API de Java
      await saveGasto(nuevoGasto, token); 

      // 4. Éxito
      toast.success('Gasto registrado', {
        description: `${categoria}: ${new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(montoNum)}`,
      });

      // Limpiar y volver al inicio
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      toast.error('Error de conexión', {
        description: 'No se pudo guardar el gasto. Verifica que el servidor esté encendido.'
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
          <p className="text-sm text-gray-500">Añade un nuevo egreso a tu cuenta</p>
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
              <Select value={categoria} onValueChange={setCategoria} required disabled={enviando}>
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