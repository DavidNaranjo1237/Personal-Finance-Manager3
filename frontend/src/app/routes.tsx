import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NuevoIngreso from './pages/NuevoIngreso';
import NuevoGasto from './pages/NuevoGasto';
import Historial from './pages/Historial';
import Presupuesto from './pages/Presupuesto';
import NuevaTransaccion from './pages/NuevaTransaccion';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login', // ✅ FIX
    element: <Login />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/nuevo-ingreso',
        element: <NuevoIngreso />,
      },
      {
        path: '/nuevo-gasto',
        element: <NuevoGasto />,
      },
      {
        path: '/presupuesto',
        element: <Presupuesto />,
      },
      {
        path: '/historial',
        element: <Historial />,
      },
      {
        path: '/nueva-transaccion',
        element: <NuevaTransaccion />,
      },
    ],
  },
]);