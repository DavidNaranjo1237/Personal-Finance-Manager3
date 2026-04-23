import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NuevoIngreso from './pages/NuevoIngreso';
import NuevoGasto from './pages/NuevoGasto';
import Historial from './pages/Historial';
import Presupuesto from './pages/Presupuesto';
//import path from 'path';

export const router = createBrowserRouter([
  {
    path: '/',
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
    ],
  },
]);
