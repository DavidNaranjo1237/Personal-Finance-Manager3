import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TrendingUp, TrendingDown, Wallet, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { TransaccionDTO } from '../types/types';
import { fetchBalance, fetchHistorial } from "../api";

function formatearMoneda(monto: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(monto || 0);
}

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function TransactionCard({ transaccion }: { transaccion: TransaccionDTO }) {
  const isIngreso = transaccion.tipo === 'INGRESO';

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`size-10 rounded-full flex items-center justify-center ${
          isIngreso ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isIngreso ? (
            <TrendingUp className="size-5 text-green-600" />
          ) : (
            <TrendingDown className="size-5 text-red-600" />
          )}
        </div>

        <div>
          <p className="font-medium">{transaccion.descripcion}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{formatearFecha(transaccion.fecha)}</span>
            {transaccion.categoria && (
              <>
                <span>•</span>
                <span>{transaccion.categoria}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <p className={`font-semibold ${
        isIngreso ? 'text-green-600' : 'text-red-600'
      }`}>
        {isIngreso ? '+' : '-'}{formatearMoneda(Number(transaccion.monto))}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [balance, setBalance] = useState({
    balance: 0,
    totalIngresos: 0,
    totalGastos: 0
  });

  const [ultimasTransacciones, setUltimasTransacciones] = useState<TransaccionDTO[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        const token = localStorage.getItem('token') || "";

        // 🔥 Validación de seguridad
        if (!token) {
          console.warn("No hay token, no se puede cargar dashboard");
          setCargando(false);
          return;
        }

        const [resBalance, resHistorial] = await Promise.all([
          fetchBalance(token),
          fetchHistorial(token)
        ]);

        const dataHistorial = Array.isArray(resHistorial) ? resHistorial : [];

        const ingresos = dataHistorial.filter((t) => t.tipo === 'INGRESO');
        const gastos = dataHistorial.filter((t) => t.tipo === 'GASTO');

        const totalI = ingresos.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);
        const totalG = gastos.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);

        setBalance({
          balance: Number(resBalance) || (totalI - totalG),
          totalIngresos: totalI,
          totalGastos: totalG
        });

        // 🔥 Ordenar por fecha descendente (más reciente primero)
        const ordenadas = dataHistorial.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );

        setUltimasTransacciones(ordenadas.slice(0, 3));

      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatosDashboard();
  }, []);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Panel Principal</h2>
        {cargando && <Loader2 className="size-5 animate-spin text-blue-500" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card className="shadow-sm border-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
              <Wallet className="size-4 text-blue-500" />
              Balance Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {cargando ? "---" : formatearMoneda(balance.balance)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
              <TrendingUp className="size-4 text-green-500" />
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {cargando ? "---" : formatearMoneda(balance.totalIngresos)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-red-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
              <TrendingDown className="size-4 text-red-500" />
              Gastos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {cargando ? "---" : formatearMoneda(balance.totalGastos)}
            </p>
          </CardContent>
        </Card>

      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimos Movimientos</CardTitle>
          <Link to="/historial">
            <Button variant="ghost" size="sm" className="text-blue-600">
              Ver todos
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-3">
          {cargando ? (
            <div className="py-10 text-center text-gray-400">Cargando...</div>
          ) : ultimasTransacciones.length > 0 ? (
            ultimasTransacciones.map((t) => (
              <TransactionCard key={t.id} transaccion={t} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay movimientos registrados aún</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}