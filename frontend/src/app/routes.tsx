import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NuevoIngreso from './pages/NuevoIngreso';
import NuevoGasto from './pages/NuevoGasto';
import Historial from './pages/Historial';

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
        path: '/historial',
        element: <Historial />,
      },
    ],
  },
]);
