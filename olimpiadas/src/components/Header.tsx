import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIncidents } from '../context/useIncidents';
import { LOCALITIES } from '../data/mockData';
import '../styles/Header.css';

export const Header: React.FC = () => {
  const { selectedLocality, setSelectedLocality, isAdmin } = useIncidents();
  const [showLocalityMenu, setShowLocalityMenu] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const location = useLocation();

  const handleLocalitySelect = (name: string) => {
    setSelectedLocality(name);
    setShowLocalityMenu(false);
  };

  const isCurrentPage = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl header-container">
      <div className="h-16 px-space-md max-w-7xl mx-auto flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <Link to="/" className="flex flex-col hover:opacity-90 transition-opacity">
            <span className="font-headline-md text-headline-md text-primary leading-none tracking-tight">MORÓN</span>
            <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">Municipio</span>
          </Link>
          
          <div className="h-6 w-px bg-outline-variant/40 ml-1"></div>
          
          <div className="relative">
            <button
              onClick={() => setShowLocalityMenu(!showLocalityMenu)}
              className="flex items-center gap-1 bg-surface-container-high/80 px-2.5 py-1 rounded-full text-secondary locality-selector text-left"
              title="Cambiar localidad"
            >
              <span className="material-symbols-outlined text-sm text-primary">location_on</span>
              <span className="font-label-sm text-label-sm">{selectedLocality}</span>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </button>

            {showLocalityMenu && (
              <div className="absolute left-0 mt-2 w-56 bg-surface-container-lowest rounded-2xl shadow-xl p-2 z-50 border border-surface-container-high animate-in fade-in zoom-in-95">
                <span className="px-3 py-1.5 block font-label-sm text-label-sm text-secondary uppercase font-bold">
                  Seleccionar Localidad
                </span>
                {LOCALITIES.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleLocalitySelect(loc.name.split(' (')[0])}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-body-md transition-colors flex items-center justify-between ${
                      selectedLocality.includes(loc.name.split(' (')[0])
                        ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                        : 'text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span>{loc.name}</span>
                    {selectedLocality.includes(loc.name.split(' (')[0]) && (
                      <span className="material-symbols-outlined text-xs text-primary">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`font-title-md text-title-md transition-colors ${
              isCurrentPage('/') ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'
            }`}
          >
            Inicio
          </Link>
          <Link
            to="/catalogo"
            className={`font-title-md text-title-md transition-colors ${
              isCurrentPage('/catalogo') ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'
            }`}
          >
            Catálogo (20)
          </Link>
          <Link
            to="/gestion"
            className={`font-title-md text-title-md flex items-center gap-1 transition-colors ${
              isCurrentPage('/gestion') ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span>Gestión Municipal</span>
            {isAdmin && (
              <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
            )}
          </Link>
          <Link
            to="/nuevo-reporte"
            className="flex items-center gap-1.5 bg-primary text-on-primary px-3.5 py-1.5 rounded-full font-title-md text-title-md hover:bg-primary-container active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add_a_photo</span>
            <span>Reportar</span>
          </Link>
        </nav>

        <div className="flex items-center gap-space-sm">
          <button
            aria-label="Notificaciones activas"
            onClick={() => {
              setShowNotificationToast(true);
              setTimeout(() => setShowNotificationToast(false), 3000);
            }}
            className="relative w-11 h-11 flex items-center justify-center rounded-full bg-surface-container-low text-secondary hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary-container notification-badge animate-pulse"></span>
          </button>

          <Link
            to="/perfil"
            className={`px-3 py-1.5 rounded-full font-label-sm text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isAdmin
                ? 'bg-inverse-surface text-inverse-on-surface ring-1 ring-tertiary-fixed shadow-sm hover:opacity-90'
                : 'bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim'
            }`}
            title={isAdmin ? 'Sesión de Gestión: Administrador' : 'Sesión activa como Vecino'}
          >
            <span className="material-symbols-outlined text-sm">
              {isAdmin ? 'shield_person' : 'person'}
            </span>
            <span className="capitalize">{isAdmin ? 'Admin' : 'Vecino'}</span>
          </Link>
        </div>
      </div>

      {showNotificationToast && (
        <div className="absolute top-18 right-4 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-2xl shadow-xl font-body-md text-xs flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-tertiary-fixed text-base">notifications_active</span>
          <span>Tenés 1 actualización de cuadrilla para tu reporte #MOR-4821</span>
        </div>
      )}
    </header>
  );
};
