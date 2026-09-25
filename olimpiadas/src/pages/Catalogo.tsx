import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES_20 } from '../data/mockData';
import { categoriesApi } from '../services/api';
import type { IncidentArea, IncidentCategory } from '../types';
import '../styles/Catalogo.css';

export const Catalogo: React.FC = () => {
  const [categories, setCategories] = useState<IncidentCategory[]>(CATEGORIES_20);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentFilter, setCurrentFilter] = useState<IncidentArea>('all');

  useEffect(() => {
    categoriesApi.getAll()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(err => console.warn('Usando categorías locales:', err));
  }, []);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return categories.filter(cat => {
      const matchesFilter = currentFilter === 'all' || cat.area === currentFilter;
      const matchesQuery =
        query === '' ||
        cat.title.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query) ||
        cat.area.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [categories, searchQuery, currentFilter]);

  return (
    <main className="relative w-full pt-16 pb-24 md:pb-12 min-h-screen bg-surface flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-space-md pb-12">
        <div className="relative overflow-hidden rounded-2xl bg-inverse-surface text-inverse-on-surface p-space-md shadow-md mb-space-lg mt-space-sm border border-surface-container-high/20">
          <div className="flex items-start gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
            </div>
            
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="font-label-md text-label-md uppercase tracking-wider text-primary-fixed-dim font-bold">
                  Peligro Inminente
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/30 text-primary-fixed font-label-sm text-label-sm font-semibold">
                  24hs Morón
                </span>
              </div>
              <p className="font-title-md text-title-md text-surface-container-lowest mt-0.5 font-bold">
                ¿Riesgo de vida o caída eléctrica activa?
              </p>
              <p className="font-body-md text-body-md text-surface-variant/80 mt-1 text-xs">
                Para emergencias críticas no esperes un ticket digital. Comunicáte de inmediato:
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <a
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm active:scale-95 transition-transform"
                  href="tel:911"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  <span>911 Central</span>
                </a>
                <a
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-highest text-inverse-surface font-label-md text-label-md shadow-sm active:scale-95 transition-transform"
                  href="tel:103"
                >
                  <span className="material-symbols-outlined text-base">security</span>
                  <span>Defensa Civil: 103</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mb-space-md">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
              Catálogo Municipal
            </span>
            <span className="font-label-sm text-label-sm text-secondary">
              20 Categorías Activas
            </span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
            ¿Qué querés reportar hoy?
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-1">
            Seleccioná el tipo de incidencia para derivar la cuadrilla barrial adecuada en Morón.
          </p>
        </div>

        <div className="relative w-full mb-space-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-xl">
            search
          </span>
          <input
            className="w-full h-12 pl-11 pr-10 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-2xl outline-none placeholder:text-secondary/70 focus:bg-surface-container-lowest focus:shadow-sm transition-all border border-surface-container-high/50"
            placeholder="Buscar bache, luminaria, árbol, basura..."
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-space-md px-space-md mb-space-md scroll-smooth no-scrollbar">
          <button
            onClick={() => setCurrentFilter('all')}
            className={`filter-chip flex items-center gap-1.5 px-3.5 py-2 rounded-full font-label-md text-label-md shrink-0 ${
              currentFilter === 'all'
                ? 'active'
                : 'bg-surface-container text-secondary hover:bg-surface-container-high'
            }`}
          >
            <span>Todos</span>
            <span className="px-1.5 py-0.2 rounded-full bg-on-primary/20 text-on-primary text-[10px]">
              20
            </span>
          </button>
          <button
            onClick={() => setCurrentFilter('vialidad')}
            className={`filter-chip flex items-center gap-1.5 px-3.5 py-2 rounded-full font-label-md text-label-md shrink-0 ${
              currentFilter === 'vialidad'
                ? 'active'
                : 'bg-surface-container text-secondary hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-sm">construction</span>
            <span>Vialidad</span>
          </button>
          <button
            onClick={() => setCurrentFilter('alumbrado')}
            className={`filter-chip flex items-center gap-1.5 px-3.5 py-2 rounded-full font-label-md text-label-md shrink-0 ${
              currentFilter === 'alumbrado'
                ? 'active'
                : 'bg-surface-container text-secondary hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-sm">electric_bolt</span>
            <span>Alumbrado & Cables</span>
          </button>
          <button
            onClick={() => setCurrentFilter('higiene')}
            className={`filter-chip flex items-center gap-1.5 px-3.5 py-2 rounded-full font-label-md text-label-md shrink-0 ${
              currentFilter === 'higiene'
                ? 'active'
                : 'bg-surface-container text-secondary hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
            <span>Higiene Urbana</span>
          </button>
          <button
            onClick={() => setCurrentFilter('espacios')}
            className={`filter-chip flex items-center gap-1.5 px-3.5 py-2 rounded-full font-label-md text-label-md shrink-0 ${
              currentFilter === 'espacios'
                ? 'active'
                : 'bg-surface-container text-secondary hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-sm">park</span>
            <span>Espacios Verdes</span>
          </button>
          <button
            onClick={() => setCurrentFilter('seguridad')}
            className={`filter-chip flex items-center gap-1.5 px-3.5 py-2 rounded-full font-label-md text-label-md shrink-0 ${
              currentFilter === 'seguridad'
                ? 'active'
                : 'bg-surface-container text-secondary hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-sm">policy</span>
            <span>Convivencia & Vía</span>
          </button>
        </div>

        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/nuevo-reporte?cat=${cat.slug}&name=${encodeURIComponent(cat.title)}`}
                className="cat-card group flex flex-col justify-between p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container-high/40 hover:border-primary/30"
              >
                <div>
                  <div className="flex items-start justify-between mb-2.5">
                    <div className={`w-10 h-10 rounded-xl ${cat.iconContainerClass} flex items-center justify-center`}>
                      <span
                        className="material-symbols-outlined text-2xl"
                        style={cat.iconFilled ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >
                        {cat.icon}
                      </span>
                    </div>
                    <span className="cat-number font-headline-md text-headline-md text-surface-container-highest select-none leading-none">
                      {cat.number}
                    </span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="font-body-md text-body-md text-secondary line-clamp-2 mt-0.5 text-xs">
                    {cat.description}
                  </p>
                </div>
                
                <div className="mt-3 pt-2.5 bg-surface-container-lowest flex items-center justify-between border-t border-surface-container-high/40">
                  <span className={`px-2 py-0.5 rounded-full ${cat.colorBadgeClass} font-label-sm text-[10px] font-bold`}>
                    {cat.sla}
                  </span>
                  <span className="material-symbols-outlined text-secondary text-sm group-hover:translate-x-0.5 group-hover:text-primary transition-all">
                    arrow_forward
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-space-lg text-center my-6 bg-surface-container-low rounded-2xl border border-surface-container-high">
            <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary mb-3">
              <span className="material-symbols-outlined text-3xl">search_off</span>
            </div>
            <p className="font-title-md text-title-md text-on-surface font-bold">
              No encontramos esa categoría
            </p>
            <p className="font-body-md text-body-md text-secondary mt-1 max-w-xs text-sm">
              Podés iniciar un reporte general y el equipo de inspección de Morón lo tipificará por vos.
            </p>
            <Link
              to="/nuevo-reporte?cat=otro-general&name=Reporte%20General"
              className="mt-4 px-5 py-2.5 rounded-full bg-primary text-on-primary font-title-md text-title-md active:scale-95 transition-transform shadow-md"
            >
              Crear Reporte General
            </Link>
          </div>
        )}

        <div className="mt-space-lg p-space-md rounded-2xl bg-surface-container flex items-center gap-space-sm border border-surface-container-highest">
          <span className="material-symbols-outlined text-primary text-3xl shrink-0">verified</span>
          <div className="flex flex-col">
            <span className="font-title-md text-title-md text-on-surface font-bold">
              Tiempos de Cuadrilla Auditados
            </span>
            <p className="font-body-md text-body-md text-secondary text-xs mt-0.5">
              Cada ticket genera un código único de seguimiento geolocalizado en Castelar, Haedo, Morón Centro y El Palomar.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
};
