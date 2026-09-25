import React from 'react';
import { NavLink } from 'react-router-dom';
import { useIncidents } from '../context/useIncidents';
import '../styles/BottomNav.css';

export const BottomNav: React.FC = () => {
  const { isAdmin } = useIncidents();

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-surface/85 backdrop-blur-xl bottom-nav">
      <div className="h-16 px-space-sm flex items-center justify-around relative max-w-md mx-auto">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] h-14 bottom-nav-link ${
              isActive ? 'text-primary font-title-md font-bold' : 'text-secondary font-body-md'
            }`
          }
        >
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="font-label-sm text-label-sm mt-0.5">Inicio</span>
        </NavLink>

        <NavLink
          to="/catalogo"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] h-14 bottom-nav-link ${
              isActive ? 'text-primary font-title-md font-bold' : 'text-secondary font-body-md'
            }`
          }
        >
          <span className="material-symbols-outlined text-2xl">grid_view</span>
          <span className="font-label-sm text-label-sm mt-0.5">Catálogo</span>
        </NavLink>

        <div className="relative -top-5 flex flex-col items-center">
          <NavLink
            to="/nuevo-reporte"
            className="w-14 h-14 rounded-full bg-primary-container text-on-primary flex items-center justify-center bottom-nav-fab active:scale-95 transition-all"
            aria-label="Crear nuevo reporte de incidencia urbana"
          >
            <span className="material-symbols-outlined text-3xl">add_a_photo</span>
          </NavLink>
          <span className="font-label-sm text-label-sm text-primary font-bold mt-1">Reportar</span>
        </div>

        {isAdmin && (
          <NavLink
            to="/gestion"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] h-14 bottom-nav-link ${
                isActive ? 'text-primary font-title-md font-bold' : 'text-secondary font-body-md'
              }`
            }
          >
            <div className="relative">
              <span className="material-symbols-outlined text-2xl">shield_person</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
            </div>
            <span className="font-label-sm text-label-sm mt-0.5">Gestión</span>
          </NavLink>
        )}

        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] h-14 bottom-nav-link ${
              isActive ? 'text-primary font-title-md font-bold' : 'text-secondary font-body-md'
            }`
          }
        >
          <span className="material-symbols-outlined text-2xl">account_circle</span>
          <span className="font-label-sm text-label-sm mt-0.5">Perfil</span>
        </NavLink>
      </div>
    </nav>
  );
};
