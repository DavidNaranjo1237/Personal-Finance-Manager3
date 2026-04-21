import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../components/ui/card';
import { Wallet } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      const result = await response.json();

console.log("Respuesta backend:", result);

// 🔴 validar correctamente
if (!result.success) {
  throw new Error(result.message || "Error en login");
}

// ✅ obtener datos reales
const userData = result.data;

localStorage.setItem("token", userData.token);
localStorage.setItem("userEmail", userData.email);

// 🚀 redirigir
navigate("/dashboard");
     

     

     
     
     
     
     

      // Puedes guardar usuario también si viene
      localStorage.setItem("userEmail", email);

      navigate("/dashboard");

    } catch (error: any) {
      console.error("Error login:", error);
      alert(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-blue-500 flex items-center justify-center">
              <Wallet className="size-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Finanzas Personales</CardTitle>
            <CardDescription>
              Gestiona tus ingresos y gastos de forma sencilla
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
