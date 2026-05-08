import { useMemo, useState,useEffect } from 'react';
import {
  AlertTriangle,
  Bus,
  CheckCircle2,
  Film,
  UtensilsCrossed,
  Wallet,
  Wrench,
  HeartPulse,
  GraduationCap,
  Shapes,
} from 'lucide-react';

type BudgetType = 'global' | 'category';

type SavedBudget = {
  month: string;
  type: BudgetType;
  category: string;
  limit: number;
};
export default function PresupuestoPage() {
  const [limit, setLimit] = useState('');
  const [budgetType, setBudgetType] = useState<BudgetType>('global');
  const [category, setCategory] = useState('');
  const [savedBudget, setSavedBudget] = useState<SavedBudget | null>(null);
  const [gastos, setGastos] = useState<any[]>([]);

  const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://personal-finance-manager3.onrender.com';

useEffect(() => {
  const cargarGastos = () => {
    fetch(`${API_URL}/api/gastos`)
      .then((res) => res.json())
      .then((data) => {
        console.log('GASTOS BACKEND:', data);

        if (Array.isArray(data) && data.length > 0) {
          setGastos(data);
          localStorage.setItem('gastos', JSON.stringify(data));
        } else {
          const gastosLocales = JSON.parse(localStorage.getItem('gastos') || '[]');
          console.log('GASTOS LOCAL:', gastosLocales);
          setGastos(gastosLocales);
        }
      })
      .catch(() => {
        const gastosLocales = JSON.parse(localStorage.getItem('gastos') || '[]');
        setGastos(gastosLocales);
      });
  };

  cargarGastos();

  const actualizar = () => {
    if (localStorage.getItem('updatePresupuesto') === 'true') {
      cargarGastos();
      localStorage.removeItem('updatePresupuesto');
    }
  };

  window.addEventListener('focus', cargarGastos);
  window.addEventListener('storage', actualizar);

  return () => {
    window.removeEventListener('focus', cargarGastos);
    window.removeEventListener('storage', actualizar);
  };
}, []);


useEffect(() => {
  const saved = localStorage.getItem('presupuesto');

  if (saved) {
    setSavedBudget(JSON.parse(saved));
  }
}, []);

const categorySpending = useMemo(() => {
  const base = [
    { name: 'Alimentación', icon: UtensilsCrossed },
    { name: 'Transporte', icon: Bus },
    { name: 'Salud', icon: HeartPulse },
    { name: 'Entretenimiento', icon: Film },
    { name: 'Educación', icon: GraduationCap },
    { name: 'Otros', icon: Shapes },
  ];

  return base.map((cat) => {
    const total = gastos
      .filter((g) => {
        if (!g?.fecha) return false;

        const categoriaBackend = (g.categoria || 'Otros')
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();

        const categoriaFrontend = cat.name
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();

        return categoriaBackend === categoriaFrontend;
      })
      .reduce((acc, g) => acc + Number(g.monto || 0), 0);

    return {
      ...cat,
      spent: total,
    };
  });
}, [gastos]);

  const currentMonth = useMemo(() => {
    return new Date().toLocaleDateString('es-CO', {
      month: 'long',
      year: 'numeric',
    });
  }, []);

  const totalSpent = useMemo(() => {
    if (!savedBudget) return 0;

    if (savedBudget.type === 'global') {
      return categorySpending.reduce((acc, item) => acc + item.spent, 0);
    }

    const selected = categorySpending.find(
      (item) => item.name === savedBudget.category
    );

    return selected?.spent ?? 0;
  }, [savedBudget,categorySpending]);

  const percentage = useMemo(() => {
    if (!savedBudget || savedBudget.limit <= 0) return 0;
    return (totalSpent / savedBudget.limit) * 100;
  }, [savedBudget, totalSpent]);

  const remaining = useMemo(() => {
    if (!savedBudget) return 0;
    return savedBudget.limit - totalSpent;
  }, [savedBudget, totalSpent]);

  const status = useMemo(() => {
    if (!savedBudget) return 'normal';
    if (percentage > 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'normal';
  }, [savedBudget, percentage]);

  const visibleCategories = useMemo(() => {
    if (!savedBudget) return categorySpending;

    if (savedBudget.type === 'global') {
      return categorySpending;
    }

    return categorySpending.filter(
      (item) => item.name === savedBudget.category
    );
  }, [savedBudget,categorySpending]);

const handleSaveBudget = () => {
  const parsedLimit = Number(limit);

  if (!parsedLimit || parsedLimit <= 0) return;

  const presupuesto = {
    month: currentMonth,
    type: budgetType,
    category: budgetType === 'category' ? category : '',
    limit: parsedLimit,
  };

  setSavedBudget(presupuesto);
  localStorage.setItem('presupuesto', JSON.stringify(presupuesto));
};

  const progressColor =
    status === 'exceeded'
      ? 'bg-red-500'
      : status === 'warning'
      ? 'bg-amber-500'
      : 'bg-blue-500';

  const alertStyles =
    status === 'exceeded'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-amber-200 bg-amber-50 text-amber-700';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Presupuesto</h1>
        <p className="mt-1 text-sm text-slate-500">
          Define tu límite mensual y controla cuánto has gastado.
        </p>
      </div>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Wallet className="size-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-slate-800">
            Crear presupuesto
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Límite mensual
            </label>
            <input
              type="number"
              min="0"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="Ej: 1000"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Tipo de presupuesto
            </label>
            <select
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value as BudgetType)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
            >
              <option value="global">Global</option>
              <option value="category">Por categoría</option>
            </select>
          </div>

          {budgetType === 'category' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400"
              >
                <option value="">Selecciona una categoría</option>
                {categorySpending.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Se asignará automáticamente a <span className="font-medium">{currentMonth}</span>.
          </p>

          <button
            onClick={handleSaveBudget}
            disabled={
              !limit || Number(limit) <= 0 || (budgetType === 'category' && !category)
            }
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Guardar presupuesto
          </button>
        </div>
      </section>

      {savedBudget && (
        <>
          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Presupuesto mensual
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {savedBudget.type === 'global'
                    ? `Presupuesto global de ${savedBudget.month}`
                    : `Presupuesto de ${savedBudget.category} para ${savedBudget.month}`}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  status === 'exceeded'
                    ? 'bg-red-100 text-red-700'
                    : status === 'warning'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {status === 'exceeded'
                  ? 'Excedido'
                  : status === 'warning'
                  ? 'Cerca del límite'
                  : 'Normal'}
              </span>
            </div>

            <div className="mt-5">
              <p className="text-base text-slate-700">
                Has gastado <span className="font-semibold">${totalSpent}</span> de{' '}
                <span className="font-semibold">${savedBudget.limit}</span>
              </p>

              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${progressColor}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-slate-500">
                <span>{percentage.toFixed(0)}% consumido</span>
                <span>
                  Disponible:{' '}
                  <span
                    className={`font-medium ${
                      remaining < 0 ? 'text-red-600' : 'text-slate-700'
                    }`}
                  >
                    ${remaining}
                  </span>
                </span>
              </div>
            </div>
          </section>

          {percentage >= 80 && (
            <section className={`rounded-2xl border p-4 shadow-sm ${alertStyles}`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 size-5 shrink-0" />
                <div>
                  <h3 className="font-semibold">
                    {percentage > 100
                      ? 'Has excedido tu presupuesto'
                      : 'Alerta preventiva'}
                  </h3>
                  <p className="mt-1 text-sm">
                    {percentage > 100
                      ? 'Ya superaste el 100% del límite definido. Revisa tus gastos para este mes.'
                      : 'Ya alcanzaste o superaste el 80% de tu presupuesto mensual.'}
                  </p>
                </div>
              </div>
            </section>
          )}

          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-slate-800">
                Categorías
              </h2>
            </div>

            <div className="space-y-4">
              {visibleCategories.map((item) => {
                const Icon = item.icon;
                const referenceLimit =
                  savedBudget.type === 'category'
                    ? savedBudget.limit
                    : Math.max(item.spent + 70, 100);

                const categoryPercentage = (item.spent / referenceLimit) * 100;

                return (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                          <Icon className="size-5" />
                        </div>
                        <span className="font-medium text-slate-800">
                          {item.name}
                        </span>
                      </div>

                      <span className="text-sm text-slate-600">
                        ${item.spent} / ${referenceLimit}
                      </span>
                    </div>

                    <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${Math.min(categoryPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
 }

