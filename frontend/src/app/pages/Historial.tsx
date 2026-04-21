import { useState, useEffect } from 'react'; // Agregamos useEffect
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, TrendingUp, TrendingDown, Filter, Loader2 } from 'lucide-react';
// Importamos la función real de tu API
import { fetchHistorial } from "../api";
import { TransaccionDTO } from '../types/types';

function formatearMoneda(monto: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(monto);
}

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function TransactionRow({ transaccion }: { transaccion: TransaccionDTO }) {
  const isIngreso = transaccion.tipo === 'INGRESO';
  
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4 flex-1">
        <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${
          isIngreso ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isIngreso ? (
            <TrendingUp className="size-6 text-green-600" />
          ) : (
            <TrendingDown className="size-6 text-red-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium truncate">{transaccion.descripcion}</p>
            <Badge variant={isIngreso ? 'default' : 'destructive'} className={
              isIngreso ? 'bg-green-600' : 'bg-red-600'
            }>
              {transaccion.tipo}
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-gray-500">
            <span>{formatearFecha(transaccion.fecha)}</span>
            {transaccion.categoria && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="text-gray-600">{transaccion.categoria}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <p className={`text-lg font-semibold ml-4 shrink-0 ${
        isIngreso ? 'text-green-600' : 'text-red-600'
      }`}>
        {isIngreso ? '+' : '-'}{formatearMoneda(transaccion.monto)}
      </p>
    </div>
  );
}

export default function Historial() {
  const navigate = useNavigate();
  const [filtroTipo, setFiltroTipo] = useState<'TODOS' | 'INGRESO' | 'GASTO'>('TODOS');
  
  // ESTADOS PARA DATOS REALES
  const [todasLasTransacciones, setTodasLasTransacciones] = useState<TransaccionDTO[]>([]);
  const [cargando, setCargando] = useState(true);

  // EFECTO PARA CARGAR DESDE EL BACKEND
  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const token = localStorage.getItem('token') || "";
        const data = await fetchHistorial(token);
        
        // Si el backend devuelve los datos correctamente, actualizamos el estado
        setTodasLasTransacciones(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando el historial de GameZone:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, []);
  
  const transaccionesFiltradas = filtroTipo === 'TODOS' 
    ? todasLasTransacciones
    : todasLasTransacciones.filter(t => t.tipo === filtroTipo);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Historial de Transacciones</h2>
          <p className="text-sm text-gray-500">
            {cargando ? 'Cargando...' : `${transaccionesFiltradas.length} ${transaccionesFiltradas.length === 1 ? 'transacción' : 'transacciones'}`}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Filter className="size-5 text-gray-500" />
            <Label className="text-sm font-medium">Filtrar por tipo:</Label>
            <Select value={filtroTipo} onValueChange={(value: any) => setFiltroTipo(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos</SelectItem>
                <SelectItem value="INGRESO">Ingresos</SelectItem>
                <SelectItem value="GASTO">Gastos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de transacciones o estado de carga */}
      {cargando ? (
        <div className="flex flex-col items-center py-20 text-gray-400">
          <Loader2 className="size-10 animate-spin mb-2" />
          <p>Conectando con el servidor de GameZone...</p>
        </div>
      ) : transaccionesFiltradas.length > 0 ? (
        <div className="space-y-3">
          {transaccionesFiltradas.map((transaccion) => (
            <TransactionRow key={transaccion.id} transaccion={transaccion} />
          ))}
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="py-16 text-center">
            <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="size-8 text-gray-400" />
            </div>
            <h3 className="text-lg mb-2 font-medium">No hay movimientos reales</h3>
            <p className="text-gray-500 mb-6">
              Aún no hemos encontrado registros en tu base de datos Docker.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => navigate('/nuevo-ingreso')}
                className="bg-green-600 hover:bg-green-700"
              >
                <TrendingUp className="size-4 mr-2" />
                Agregar Ingreso
              </Button>
              <Button
                onClick={() => navigate('/nuevo-gasto')}
                className="bg-red-600 hover:bg-red-700"
              >
                <TrendingDown className="size-4 mr-2" />
                Agregar Gasto
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}