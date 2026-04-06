import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Home, TrendingUp, TrendingDown, History, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect } from 'react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail && location.pathname !== '/') {
      navigate('/');
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Inicio' },
    { path: '/nuevo-ingreso', icon: TrendingUp, label: 'Ingreso' },
    { path: '/nuevo-gasto', icon: TrendingDown, label: 'Gasto' },
    { path: '/historial', icon: History, label: 'Historial' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header para desktop */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xl">💰</span>
            </div>
            <div>
              <h1 className="text-xl">Finanzas Personales</h1>
              <p className="text-sm text-gray-500">
                {localStorage.getItem('userEmail')}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="size-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Navegación lateral para desktop */}
      <div className="hidden md:flex">
        <nav className="w-64 bg-white border-r min-h-[calc(100vh-73px)] p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>
                  <Button
                    variant={isActive(item.path) ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      isActive(item.path) ? 'bg-blue-500 hover:bg-blue-600' : ''
                    }`}
                  >
                    <item.icon className="size-5 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contenido principal */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Contenido principal para mobile */}
      <main className="md:hidden pb-20">
        <div className="p-4">
          <Outlet />
        </div>
      </main>

      {/* Navegación inferior para mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <ul className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                    isActive(item.path) ? 'text-blue-500' : 'text-gray-600'
                  }`}
                >
                  <item.icon className="size-5" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
