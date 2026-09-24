import React, { useState, useMemo } from 'react';
import { useIncidents } from '../context/useIncidents';
import type { Incident } from '../types';
import '../styles/Gestion.css';

export const Gestion: React.FC = () => {
  const { incidents, updateIncidentStatus, dismissIncident, refreshData } = useIncidents();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  // Modal inspection drawer
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [inspectorNotes, setInspectorNotes] = useState<string>('');
  const [selectedCuadrilla, setSelectedCuadrilla] = useState<string>('Obras Públicas y Bacheo');

  // Refresh & Toast
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    showToast('Datos municipales sincronizados en tiempo real');
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Metrics calculation
  const pendingCount = incidents.filter(i => i.status === 'pendiente').length;
  const inProcessCount = incidents.filter(i => i.status === 'proceso').length;
  const resolvedCount = incidents.filter(i => i.status === 'resuelto').length;
  const dismissedCount = incidents.filter(i => i.status === 'desestimado').length;
  const totalCount = incidents.length;

  const filteredIncidents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return incidents.filter(item => {
      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter;
      const matchesArea =
        areaFilter === 'all' || item.area === areaFilter;
      const matchesSearch =
        query === '' ||
        item.id.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.reportedBy.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query);
      return matchesStatus && matchesArea && matchesSearch;
    });
  }, [incidents, searchQuery, statusFilter, areaFilter]);

  const openInspectionModal = (incident: Incident) => {
    setSelectedIncident(incident);
    setInspectorNotes(
      incident.inspectorNotes ||
        `Inspección preliminar realizada. Zona verificada en el ejido de ${incident.locality}.`
    );
    setSelectedCuadrilla(incident.assignedCuadrilla || 'Obras Públicas y Bacheo');
  };

  const handleDispatchOrder = () => {
    if (!selectedIncident) return;
    updateIncidentStatus(
      selectedIncident.id,
      'proceso',
      selectedCuadrilla,
      inspectorNotes
    );
    showToast(`Orden #${selectedIncident.id} despachada a ${selectedCuadrilla}`);
    setSelectedIncident(null);
  };

  const handleMarkResolved = (id: string) => {
    updateIncidentStatus(id, 'resuelto');
    showToast(`Reporte #${id} marcado como Resuelto`);
    if (selectedIncident?.id === id) setSelectedIncident(null);
  };

  const handleDismiss = (id: string) => {
    dismissIncident(id);
    showToast(`Reporte #${id} desestimado / archivado`);
  };

  return (
    <main className="relative w-full pt-16 pb-24 md:pb-12 min-h-screen bg-surface flex flex-col">
      <div className="max-w-4xl mx-auto w-full pb-10">
        
        {/* Status & Quick Switch Header */}
        <section className="px-space-md pt-space-md">
          <div className="bg-inverse-surface rounded-2xl p-space-md shadow-md text-inverse-on-surface relative overflow-hidden border border-surface-container-high/20">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between gap-space-sm mb-space-sm relative z-10">
              <div className="flex items-center gap-1.5 bg-surface-container-lowest/15 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-ping"></span>
                <span className="font-label-sm text-label-sm text-tertiary-fixed tracking-wider uppercase font-bold">
                  Operaciones Urbanas Morón
                </span>
              </div>
              
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1 text-surface-variant hover:text-on-primary active:scale-95 transition-all text-xs font-title-md bg-surface-container-lowest/10 px-3 py-1 rounded-full"
                id="refreshBtn"
              >
                <span className={`material-symbols-outlined text-sm transition-transform duration-500 ${isRefreshing ? 'rotate-180' : ''}`}>
                  sync
                </span>
                <span className="font-label-sm text-label-sm font-semibold">En Vivo</span>
              </button>
            </div>

            <div className="flex items-baseline justify-between relative z-10">
              <div>
                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary font-bold">
                  Mesa de Control
                </h1>
                <p className="font-body-md text-body-md text-surface-dim mt-0.5">
                  Supervisión operativa y asignación de cuadrillas
                </p>
              </div>
              <div className="bg-primary px-3 py-1.5 rounded-xl text-center shrink-0">
                <span className="font-label-sm text-label-sm block text-on-primary opacity-80">
                  SLA Morón
                </span>
                <span className="font-title-md text-title-md font-bold text-on-primary">
                  94.2%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics Row */}
        <section className="mt-space-md px-space-md">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-bold">
              Métricas de la Semana
            </span>
            <span className="font-label-sm text-label-sm text-primary font-bold">
              Total: {totalCount} reclamos
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
            {/* Pendientes */}
            <div className="bg-tertiary-fixed/30 p-space-sm rounded-2xl shadow-sm flex flex-col justify-between border border-tertiary-fixed/40">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-tertiary-fixed font-bold uppercase">
                  Pendientes
                </span>
                <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-tertiary font-bold">
                  {pendingCount}
                </span>
                <span className="font-label-sm text-label-sm text-tertiary-container font-semibold">
                  a revisar
                </span>
              </div>
              <div className="w-full bg-tertiary-fixed rounded-full h-1.5 mt-2">
                <div
                  className="bg-tertiary-container h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (pendingCount / (totalCount || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* En Proceso */}
            <div className="bg-secondary-fixed/40 p-space-sm rounded-2xl shadow-sm flex flex-col justify-between border border-secondary-fixed/50">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-secondary-fixed font-bold uppercase">
                  En Cuadrilla
                </span>
                <span className="material-symbols-outlined text-sm text-secondary">engineering</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-secondary font-bold">
                  {inProcessCount}
                </span>
                <span className="font-label-sm text-label-sm text-on-secondary-container font-semibold">
                  activas
                </span>
              </div>
              <div className="w-full bg-secondary-fixed rounded-full h-1.5 mt-2">
                <div
                  className="bg-secondary h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (inProcessCount / (totalCount || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Resueltos */}
            <div className="bg-surface-container-lowest p-space-sm rounded-2xl shadow-sm flex items-center gap-space-sm border border-surface-container-high/50">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  task_alt
                </span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-secondary uppercase block font-bold">
                  Resueltos
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-title-lg text-title-lg text-on-surface font-bold">
                    {resolvedCount}
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-bold">
                    {totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Desestimados */}
            <div className="bg-surface-container-lowest p-space-sm rounded-2xl shadow-sm flex items-center gap-space-sm border border-surface-container-high/50">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-lg">cancel</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-secondary uppercase block font-bold">
                  Desestimados
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-title-lg text-title-lg text-on-surface font-bold">
                    {dismissedCount}
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary text-xs">
                    archivados
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Controls */}
        <section className="mt-space-md px-space-md">
          {/* Live Search Bar */}
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg">
              search
            </span>
            <input
              className="w-full h-11 pl-10 pr-10 rounded-2xl bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm border border-surface-container-high placeholder:text-secondary/60 focus:outline-none focus:bg-surface-container-low transition-colors"
              placeholder="Buscar por N° reclamo (#MOR-...) o vecino..."
              type="text"
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

          {/* Status Filters (Pills) */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2 mt-2 no-scrollbar">
            {[
              { id: 'all', label: `Todos (${totalCount})` },
              { id: 'pendiente', label: `Pendientes (${pendingCount})` },
              { id: 'proceso', label: `En Proceso (${inProcessCount})` },
              { id: 'resuelto', label: `Resueltos (${resolvedCount})` },
              { id: 'desestimado', label: `Desestimados (${dismissedCount})` },
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setStatusFilter(btn.id)}
                className={`status-filter-btn px-3.5 py-1.5 rounded-full font-label-md text-label-md shrink-0 shadow-sm transition-transform active:scale-95 ${
                  statusFilter === btn.id
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container-lowest text-secondary hover:bg-surface-container'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Category Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-2 no-scrollbar">
            <span className="font-label-sm text-label-sm text-secondary shrink-0 font-bold">ÁREA:</span>
            {[
              { id: 'all', label: 'Todas', icon: 'apps' },
              { id: 'vialidad', label: 'Baches & Vías', icon: 'traffic' },
              { id: 'alumbrado', label: 'Alumbrado', icon: 'lightbulb' },
              { id: 'higiene', label: 'Higiene Urbana', icon: 'delete' },
              { id: 'espacios', label: 'Morón Verde', icon: 'park' },
              { id: 'seguridad', label: 'Convivencia', icon: 'policy' },
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => setAreaFilter(pill.id)}
                className={`px-2.5 py-1 rounded-lg font-label-sm text-label-sm shrink-0 flex items-center gap-1 font-semibold transition-colors ${
                  areaFilter === pill.id
                    ? 'bg-secondary text-on-secondary font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-xs">{pill.icon}</span>
                <span>{pill.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Incident Reports Feed */}
        <section className="mt-space-sm px-space-md space-y-space-sm">
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map((incident) => {
              const isPending = incident.status === 'pendiente';
              const isInProcess = incident.status === 'proceso';
              const isResolved = incident.status === 'resuelto';

              return (
                <article
                  key={incident.id}
                  className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm space-y-3 report-card border border-surface-container-high/40 hover:border-surface-container-highest"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary font-headline-md text-label-md px-2.5 py-0.5 rounded font-bold">
                        #{incident.id}
                      </span>
                      
                      {isPending && (
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-ping"></span>
                          Pendiente
                        </span>
                      )}
                      {isInProcess && (
                        <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-xs">engineering</span>
                          En Cuadrilla
                        </span>
                      )}
                      {isResolved && (
                        <span className="bg-emerald-100 text-emerald-800 font-label-sm text-label-sm px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          Resuelto
                        </span>
                      )}
                      {incident.status === 'desestimado' && (
                        <span className="bg-red-100 text-red-800 font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-semibold">
                          Desestimado
                        </span>
                      )}
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary">
                      {incident.timeAgo}
                    </span>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-surface-container border border-surface-container-high">
                      {incident.images.length > 0 ? (
                        <img
                          className="w-full h-full object-cover"
                          alt={incident.title}
                          src={incident.images[0]}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined text-2xl">image_not_supported</span>
                        </div>
                      )}
                      {incident.images.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-inverse-surface/80 text-on-primary font-label-sm text-[10px] px-1 rounded">
                          +{incident.images.length} fotos
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="font-title-md text-title-md text-on-surface font-bold truncate">
                        {incident.title}
                      </h2>
                      <div className="flex items-center gap-1 text-secondary mt-0.5">
                        <span className="material-symbols-outlined text-sm text-primary shrink-0">
                          location_on
                        </span>
                        <p className="font-body-md text-body-md text-secondary truncate text-xs">
                          {incident.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-on-surface-variant mt-1.5 bg-surface-container-low px-2 py-0.5 rounded-lg text-xs w-fit max-w-full">
                        <span className="material-symbols-outlined text-xs">account_circle</span>
                        <span className="font-label-sm text-label-sm truncate">
                          {incident.reportedBy} ({incident.reporterEmail})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cuadrilla inline note if already assigned */}
                  {incident.assignedCuadrilla && (
                    <div className="bg-surface-container-low p-2.5 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-[10px]">
                          CM
                        </div>
                        <div>
                          <p className="font-title-md text-xs text-on-surface font-bold leading-tight">
                            {incident.assignedCuadrilla}
                          </p>
                          {incident.operatorInCharge && (
                            <p className="font-label-sm text-label-sm text-secondary">
                              A cargo: {incident.operatorInCharge}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    {isPending && (
                      <button
                        onClick={() => openInspectionModal(incident)}
                        className="flex-1 h-10 bg-primary text-on-primary rounded-xl font-title-md text-body-md font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-primary-container"
                      >
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        <span>Aprobar e Iniciar Cuadrilla</span>
                      </button>
                    )}

                    {isInProcess && (
                      <>
                        <button
                          onClick={() => handleMarkResolved(incident.id)}
                          className="flex-1 h-10 bg-emerald-600 text-white rounded-xl font-title-md text-body-md font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-emerald-700"
                        >
                          <span className="material-symbols-outlined text-lg">done_all</span>
                          <span>Completar y Cerrar</span>
                        </button>
                        <button
                          onClick={() => openInspectionModal(incident)}
                          className="h-10 px-3 bg-surface-container-high text-on-surface rounded-xl font-title-md text-body-md flex items-center justify-center gap-1"
                          title="Ver Ficha Técnica"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </button>
                      </>
                    )}

                    {isResolved && (
                      <button
                        onClick={() => openInspectionModal(incident)}
                        className="flex-1 h-10 bg-surface-container-high text-on-surface rounded-xl font-title-md text-body-md flex items-center justify-center gap-1.5 hover:bg-surface-container-highest"
                      >
                        <span className="material-symbols-outlined text-base">description</span>
                        <span>Ver Ficha Resuelta</span>
                      </button>
                    )}

                    {incident.status !== 'desestimado' && (
                      <button
                        onClick={() => handleDismiss(incident.id)}
                        className="h-10 px-3 bg-error-container text-on-error-container rounded-xl font-title-md text-body-md flex items-center justify-center gap-1 active:scale-95 transition-all hover:bg-error/20"
                        title="Rechazar o marcar duplicado"
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="p-8 text-center bg-surface-container-low rounded-2xl text-secondary">
              <span className="material-symbols-outlined text-4xl text-secondary/60 mb-2">
                assignment_turned_in
              </span>
              <p className="font-title-md text-on-surface font-bold">
                No hay reclamos que coincidan con los filtros
              </p>
              <p className="font-body-md text-xs mt-1">
                Probá cambiando el estado o la consulta de búsqueda.
              </p>
            </div>
          )}
        </section>

      </div>

      {/* Expanded Modal / Bottom Drawer for Inspection & Cuadrilla Assignment */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end justify-center p-0 transition-opacity animate-in fade-in">
          <div className="bg-surface w-full max-w-lg rounded-t-3xl p-space-lg max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl relative animate-in slide-in-from-bottom duration-300 border-t border-surface-container-high">
            
            {/* Drawer Handle & Header */}
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-1.5 bg-outline-variant/60 rounded-full mb-3 cursor-pointer"
                onClick={() => setSelectedIncident(null)}
              ></div>
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-on-primary font-headline-md text-label-md px-2.5 py-0.5 rounded font-bold">
                    #{selectedIncident.id}
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary">
                    Ficha Técnica Oficial Morón
                  </span>
                </div>
                <button
                  className="w-8 h-8 rounded-full bg-surface-container-high text-secondary flex items-center justify-center hover:text-on-surface"
                  onClick={() => setSelectedIncident(null)}
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>

            {/* Title & Loc */}
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {selectedIncident.title}
              </h3>
              <p className="font-body-md text-body-md text-secondary flex items-center gap-1 mt-1 text-sm">
                <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                <span>{selectedIncident.location}</span>
              </p>
            </div>

            {/* Mini Map Component (GIS Preview Moron) */}
            <div className="w-full h-36 rounded-2xl overflow-hidden relative shadow-inner border border-surface-container-high">
              <div className="absolute top-2 left-2 z-10 bg-surface/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-title-md text-on-surface shadow flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Geolocalización Confirmada
              </div>
              <div
                className="absolute inset-0 gis-map-preview"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAyT-YTIFMT4tU6F0N2TREEMyNWka9RLFa8lGhw_mo0kAVZDpLMvPiDoHecTwA5dnlk24RSeyfnkrurBxttyLSrHr_TcsK6bMDdOcULRaQtih1ZFLMil9mlCQFe4WkRdBWmgwYMcor2IUzkWdptBO9yM4FbCwwHW-F0HRvx9xakHCrPRs5qcR9OXCr6NWpZx8RQl9TTf1MCvozvGCChg8oBUeXOpevKLI_vQNvOi4XXrDt0D75SEDlm')`,
                }}
              ></div>
            </div>

            {/* Citizen Info Card */}
            <div className="bg-surface-container-lowest p-space-sm rounded-2xl flex items-center justify-between shadow-sm border border-surface-container-high/60">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">person</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-secondary uppercase">
                    Vecino Informante
                  </p>
                  <p className="font-title-md text-title-md text-on-surface font-semibold">
                    {selectedIncident.reportedBy} ({selectedIncident.reporterEmail})
                  </p>
                </div>
              </div>
              <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-lg">
                DNI Verificado
              </span>
            </div>

            {/* Inspector Field Notes */}
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-secondary uppercase block font-bold">
                Notas y Observaciones del Inspector
              </label>
              <textarea
                className="w-full p-3 rounded-2xl bg-surface-container-lowest shadow-sm text-body-md font-body-md text-on-surface border border-surface-container-high focus:outline-none"
                rows={2}
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
              />
            </div>

            {/* Cuadrilla Selector */}
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-secondary uppercase block font-bold">
                Cuadrilla Responsable Asignada
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    name: 'Obras Públicas y Bacheo',
                    desc: 'Cuadrilla Móvil #4 (Castelar / Morón)',
                    icon: 'construction',
                    color: 'text-primary',
                  },
                  {
                    name: 'Defensa Civil y Emergencias',
                    desc: 'Respuesta inmediata de seguridad urbana',
                    icon: 'engineering',
                    color: 'text-tertiary',
                  },
                  {
                    name: 'Morón Verde e Higiene',
                    desc: 'Limpieza, Poda y Vía Pública',
                    icon: 'park',
                    color: 'text-secondary',
                  },
                ].map(cuad => (
                  <label
                    key={cuad.name}
                    className={`flex items-center justify-between p-3 rounded-2xl bg-surface-container-lowest shadow-sm cursor-pointer border transition-colors ${
                      selectedCuadrilla === cuad.name
                        ? 'border-primary bg-primary-fixed/20'
                        : 'border-surface-container-high hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`material-symbols-outlined ${cuad.color}`}>
                        {cuad.icon}
                      </span>
                      <div>
                        <p className="font-title-md text-title-md text-on-surface font-bold leading-none">
                          {cuad.name}
                        </p>
                        <p className="font-label-sm text-label-sm text-secondary mt-0.5">
                          {cuad.desc}
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="cuadrilla_choice"
                      className="accent-primary w-5 h-5"
                      checked={selectedCuadrilla === cuad.name}
                      onChange={() => setSelectedCuadrilla(cuad.name)}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Action Confirmation Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleDispatchOrder}
                className="flex-1 h-12 bg-primary text-on-primary rounded-xl font-title-md text-body-lg font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined">send_and_archive</span>
                Despachar Orden de Trabajo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-full shadow-2xl font-label-md text-label-md flex items-center gap-2 z-50 animate-in fade-in zoom-in-95">
          <span className="material-symbols-outlined text-tertiary-fixed text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
};
