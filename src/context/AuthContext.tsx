import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define la estructura del usuario según tu BD
interface User {
  idUsuario: number;
  nombres: string;
  correo: string;
  rol: 'Administrador' | 'Docente' | 'Estudiante' | 'Apoderado';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// 1. Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Creamos el "Proveedor" que envuelve la app
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    // Aquí también guardarías el token JWT o la sesión
  };

  const logout = () => {
    setUser(null);
    // Aquí limpiarías el token o la sesión
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Creamos un "hook" para usarlo fácil
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}