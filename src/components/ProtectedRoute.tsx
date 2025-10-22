import React, { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Roles permitidos (de tu BD)
type Role = 'Administrador' | 'Docente' | 'Estudiante' | 'Apoderado';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: Role[]; // Un array de roles que SÍ pueden entrar
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // 1. ¿Está logueado?
  if (!isAuthenticated || !user) {
    // Si no, redirige a login. Guardamos de dónde venía.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. ¿Está logueado Y tiene el rol permitido?
  if (allowedRoles.includes(user.rol)) {
    // Si tiene permiso, muestra la página solicitada
    return children;
  } else {
    // Si está logueado pero NO tiene permiso (ej. un Estudiante en ruta de Admin)
    return <Navigate to="/unauthorized" replace />;
  }
}