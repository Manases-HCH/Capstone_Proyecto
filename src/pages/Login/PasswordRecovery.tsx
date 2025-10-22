import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  ArrowLeft, 
  Mail, 
  CheckCircle, 
  AlertTriangle, 
  Key, 
  Eye, 
  EyeOff, 
  School 
} from 'lucide-react';

interface PasswordRecoveryProps {
  onBack: () => void;
  mode?: 'request' | 'reset';
  resetToken?: string;
  onShowReset?: () => void;
}

export function PasswordRecovery({ onBack, mode = 'request', resetToken, onShowReset }: PasswordRecoveryProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validaciones
    if (!email.trim()) {
      setError('Por favor ingrese su correo electrónico');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@swiaape.edu.pe')) {
      setError('Debe usar su correo institucional (@swiaape.edu.pe)');
      setIsLoading(false);
      return;
    }

    // Simular envío de email
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (err) {
      setError('Error al enviar el enlace. Inténtelo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validaciones
    if (!password.trim() || !confirmPassword.trim()) {
      setError('Por favor complete todos los campos');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      setError('La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial');
      setIsLoading(false);
      return;
    }

    // Simular actualización de contraseña
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (err) {
      setError('Error al actualizar la contraseña. Inténtelo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === 'request') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[#800020] text-white py-4 shadow-lg">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-4">
              <School className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-semibold">SWIAAPE</h1>
                <p className="text-white/90">Sistema Web Integral de Administración Académica</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg border-0 ring-1 ring-gray-200">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-[#800020] rounded-full flex items-center justify-center">
                  <Key className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#800020]">
                  {isSuccess ? '¡Enlace Enviado!' : 'Recuperar Contraseña'}
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  {isSuccess 
                    ? 'Hemos enviado un enlace de recuperación a tu correo electrónico'
                    : 'Ingresa tu correo institucional para recibir un enlace de restablecimiento'
                  }
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {isSuccess ? (
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">
                        Enlace enviado a: {email}
                      </p>
                      <Alert className="border-gray-200 bg-gray-50">
                        <Mail className="h-4 w-4 text-gray-600" />
                        <AlertDescription className="text-gray-700">
                          Revisa tu bandeja de entrada o la carpeta de SPAM. 
                          El enlace expira en 24 horas.
                        </AlertDescription>
                      </Alert>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        onClick={() => setIsSuccess(false)}
                        variant="outline" 
                        className="w-full"
                      >
                        Enviar nuevamente
                      </Button>
                      
                      {onShowReset && (
                        <Button 
                          onClick={onShowReset}
                          className="w-full bg-[#28a745] hover:bg-[#218838]"
                        >
                          Simular enlace recibido (Demo)
                        </Button>
                      )}
                      
                      <Button 
                        onClick={onBack}
                        className="w-full bg-[#800020] hover:bg-[#600018]"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver al inicio
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRequestReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Institucional</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="usuario@swiaape.edu.pe"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12"
                        disabled={isLoading}
                      />
                    </div>

                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full bg-[#28a745] hover:bg-[#218838] h-12"
                        disabled={isLoading || !email.trim()}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Enviando...
                          </div>
                        ) : (
                          <>
                            <Mail className="h-5 w-5 mr-2" />
                            Enviar Enlace
                          </>
                        )}
                      </Button>

                      <Button 
                        type="button"
                        onClick={onBack}
                        variant="outline" 
                        className="w-full"
                        disabled={isLoading}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver al inicio
                      </Button>
                    </div>

                    <Alert className="border-gray-200 bg-gray-50">
                      <AlertTriangle className="h-4 w-4 text-gray-600" />
                      <AlertDescription className="text-gray-700">
                        Si no tienes acceso a tu correo institucional, 
                        contacta al administrador del sistema.
                      </AlertDescription>
                    </Alert>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Reset password mode
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#800020] text-white py-4 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4">
            <School className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-semibold">SWIAAPE</h1>
              <p className="text-white/90">Sistema Web Integral de Administración Académica</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-0 ring-1 ring-gray-200">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-[#800020] rounded-full flex items-center justify-center">
                <Key className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-[#800020]">
                {isSuccess ? '¡Contraseña Actualizada!' : 'Nueva Contraseña'}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {isSuccess 
                  ? 'Tu contraseña ha sido actualizada correctamente'
                  : 'Define tu nueva contraseña para acceder al sistema'
                }
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {isSuccess ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      Contraseña actualizada exitosamente
                    </p>
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        Ya puedes iniciar sesión con tu nueva contraseña.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <Button 
                    onClick={onBack}
                    className="w-full bg-[#800020] hover:bg-[#600018]"
                  >
                    Ir al inicio de sesión
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nueva Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Password Requirements */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Requisitos de contraseña:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li className={password.length >= 8 ? 'text-green-700' : ''}>
                        • Mínimo 8 caracteres
                      </li>
                      <li className={/[A-Z]/.test(password) ? 'text-green-700' : ''}>
                        • Al menos una letra mayúscula
                      </li>
                      <li className={/[a-z]/.test(password) ? 'text-green-700' : ''}>
                        • Al menos una letra minúscula
                      </li>
                      <li className={/\d/.test(password) ? 'text-green-700' : ''}>
                        • Al menos un número
                      </li>
                      <li className={/[@$!%*?&]/.test(password) ? 'text-green-700' : ''}>
                        • Al menos un carácter especial (@$!%*?&)
                      </li>
                    </ul>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#28a745] hover:bg-[#218838] h-12"
                    disabled={isLoading || !password.trim() || !confirmPassword.trim()}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Actualizando...
                      </div>
                    ) : (
                      <>
                        <Key className="h-5 w-5 mr-2" />
                        Actualizar Contraseña
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}