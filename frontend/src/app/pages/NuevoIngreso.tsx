import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { saveIngreso } from "../api";

export default function NuevoIngreso() {
  const navigate = useNavigate();
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const montoNum = parseFloat(monto);

    // 🔴 Validación monto
    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    // 🔴 Validación fecha
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada > hoy) {
      toast.error('La fecha no puede ser futura');
      return;
    }

    // 🔴 Validación sesión (MEJORA CLAVE)
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!userEmail || !token) {
      toast.error('Sesión inválida o expirada');
      navigate('/');
      return;
    }

    const nuevoIngreso = {
      monto: montoNum,
      fecha,
      descripcion,
      usuarioEmail: userEmail,
    };

    setLoading(true);

    try {
      await saveIngreso(nuevoIngreso, token);

      toast.success('Registro guardado correctamente', {
        description: `Ingreso de ${new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(montoNum)} registrado en la base de datos`,
      });

      // 🔄 limpiar formulario
      setMonto('');
      setDescripcion('');
      setFecha(new Date().toISOString().split('T')[0]);

      // 🔁 redirigir
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);

    } catch (error: any) {
      console.error("Error al guardar ingreso:", error);

      toast.error('Error al guardar el ingreso', {
        description: error?.message || 'Verifica que el backend esté activo',
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          disabled={loading}
        >
          <ArrowLeft className="size-5" />
        </Button>

        <div>
          <h2 className="text-2xl font-bold">Registrar Ingreso</h2>
          <p className="text-sm text-gray-500">
            Añade un nuevo ingreso a tu cuenta
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="size-6 text-green-600" />
            </div>
            <div>
              <CardTitle>Nuevo Ingreso</CardTitle>
              <CardDescription>
                Los datos se guardarán en tu historial financiero
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2">
              <Label htmlFor="monto">
                Monto <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>

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
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha">
                Fecha <span className="text-red-500">*</span>
              </Label>

              <Input
                id="fecha"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">
                Descripción <span className="text-red-500">*</span>
              </Label>

              <Textarea
                id="descripcion"
                placeholder="Ej: Salario, Venta, Ingreso extra..."
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Ingreso'}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

    </div>
  );
}