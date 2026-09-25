import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIncidents } from '../context/useIncidents';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: 'inspector' | 'admin';
}

/**
 * Componente Guardián de Rutas Protegidas (Opción B: Modo Anónimo / Acceso Ciudadano)
 * 
 * - Verifica la existencia y validez del token JWT y el perfil de usuario.
 * - Si no hay sesión activa o el token expiró, redirige inmediatamente a /acceso
 *   reemplazando el historial del navegador (`replace: true`), lo que impide que
 *   al presionar el botón "Atrás" se acceda a datos protegidos en caché.
 * - Preserva la ruta solicitada en `location.state.from` para retornar tras autenticarse.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading, isAdmin } = useIncidents();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="w-full min-h-screen pt-20 flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          <p className="text-secondary text-sm font-body-md">Verificando sesión ciudadana...</p>
        </div>
      </main>
    );
  }

  // 1. Redirección si no está autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/acceso" replace state={{ from: location }} />;
  }

  // 2. Control de rol específico (Gestión Municipal / Administradores)
  if (requiredRole) {
    const hasAuthorizedRole = isAdmin && (user.role === 'admin' || user.role === 'inspector');
    if (!hasAuthorizedRole) {
      return <Navigate to="/inicio" replace />;
    }
  }

  return children;
};
