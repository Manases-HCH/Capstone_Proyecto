import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { School, Search, LogIn, Shield, AlertTriangle } from 'lucide-react';

interface LandingPageProps {
  onLogin: (email: string, password: string) => void;
  onDNISearch: (dni: string) => Promise<boolean>; // ✅ Correcto
  onForgotPassword: () => void;
}

export function LandingPage({ onLogin, onDNISearch, onForgotPassword }: LandingPageProps) {
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dniError, setDniError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [rateLimitError, setRateLimitError] = useState('');
  const [queryCount, setQueryCount] = useState(0);

  const handleDNISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDniError('');
    setRateLimitError('');

    // Rate limiting simulation
    if (queryCount >= 5) {
      setRateLimitError('Demasiadas consultas. Inténtelo nuevamente en unos minutos.');
      return;
    }

    if (!dni.trim()) {
      setDniError('Por favor ingrese un DNI válido');
      return;
    }

    if (dni.length !== 8 || !/^\d+$/.test(dni)) {
      setDniError('El DNI debe contener 8 dígitos');
      return;
    }

    setQueryCount(prev => prev + 1);
    const found = onDNISearch(dni);
    
    if (!found) {
      setDniError('No se encontraron registros para este DNI');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email.trim() || !password.trim()) {
      setLoginError('Por favor complete todos los campos');
      return;
    }

    if (!email.includes('@swiaape.edu.pe')) {
      setLoginError('Debe usar su correo institucional');
      return;
    }

    try {
      onLogin(email, password);
    } catch {
      setLoginError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-[#800020] text-white py-6 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4">
            <School className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-bold">SWIAAPE</h1>
              <p className="text-white/90">Sistema Web Integral de Administración Académica y Planes de Estudio</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Consulta de Calificaciones */}
          <Card className="shadow-lg border-0 ring-1 ring-gray-200">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-[#800020]">
                <Search className="h-6 w-6" />
                Consulta de Calificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleDNISubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI del Estudiante</Label>
                  <Input
                    id="dni"
                    type="text"
                    placeholder="Ingresa DNI..."
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    maxLength={8}
                    className="h-12 text-lg"
                  />
                </div>

                {dniError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {dniError}
                    </AlertDescription>
                  </Alert>
                )}

                {rateLimitError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {rateLimitError}
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-[#28a745] hover:bg-[#218838] h-12"
                  disabled={!dni.trim() || queryCount >= 5}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Consultar
                </Button>

                <p className="text-sm text-gray-600 mt-4">
                  <Shield className="h-4 w-4 inline mr-1" />
                  La información proviene del registro oficial.
                </p>
                
                <p className="text-xs text-gray-500">
                  Máximo 5 consultas por minuto por IP
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Acceso de Usuarios */}
          <Card className="shadow-lg border-0 ring-1 ring-gray-200">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-[#800020]">
                <LogIn className="h-6 w-6" />
                Acceso de Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Institucional</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@swiaape.edu.pe"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
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
                    className="h-12"
                  />
                </div>

                {loginError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {loginError}
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-[#007bff] hover:bg-[#0056b3] h-12"
                  disabled={!email.trim() || !password.trim()}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Iniciar Sesión
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-[#007bff] hover:underline focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 rounded"
                    onClick={onForgotPassword}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Contacto</h3>
              <p>Teléfono: (01) 234-5678</p>
              <p>Email: info@swiaape.edu.pe</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Dirección</h3>
              <p>Av. Educación 123</p>
              <p>Lima, Perú</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Políticas</h3>
              <a href="#" className="block hover:text-[#800020]">Privacidad</a>
              <a href="#" className="block hover:text-[#800020]">Términos de Uso</a>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t border-gray-300">
            <p className="text-gray-500">© 2025 SWIAAPE. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}