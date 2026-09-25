import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/useIncidents';
import { LOCALITIES } from '../data/mockData';

export const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, incidents, logout, isLoading: isContextLoading } = useIncidents();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'perfil' | 'reportes'>('perfil');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(user.name || '');
  const [editPhone, setEditPhone] = useState<string>(user.phone || '');
  const [editLocality, setEditLocality] = useState<string>(user.locality || 'Morón Centro');
  const [editPhotoUrl, setEditPhotoUrl] = useState<string>(user.avatarUrl || user.photoUrl || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simula estado de carga/sincronización con fallback suave para evitar que se vea vacío
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    setEditName(user.name || '');
    setEditPhone(user.phone || '');
    setEditLocality(user.locality || 'Morón Centro');
    setEditPhotoUrl(user.avatarUrl || user.photoUrl || '');
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reportes exclusivos del usuario logueado
  const userIncidents = useMemo(() => {
    if (!user || !user.email) return [];
    const userEmailLower = user.email.toLowerCase().trim();
    const userNameLower = (user.name || '').toLowerCase().trim();

    return incidents.filter(i => {
      const matchEmail = i.reporterEmail && i.reporterEmail.toLowerCase().trim() === userEmailLower;
      const matchName = i.reportedBy && i.reportedBy.toLowerCase().trim() === userNameLower;
      return matchEmail || matchName;
    });
  }, [incidents, user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('El nombre no puede estar vacío');
      return;
    }

    const updated = {
      ...user,
      name: editName.trim(),
      phone: editPhone.trim(),
      locality: editLocality,
      avatarUrl: editPhotoUrl.trim() || undefined,
      photoUrl: editPhotoUrl.trim() || undefined,
    };

    setUser(updated);
    localStorage.setItem('moron_resuelve_user', JSON.stringify(updated));
    setIsEditing(false);
    showToast('Tus datos fueron actualizados correctamente.');
  };

  const handleLogout = () => {
    logout();
    showToast('Sesión cerrada');
    navigate('/acceso');
  };

  if (isLoading || isContextLoading) {
    return (
      <main className="relative w-full pt-20 pb-24 md:pb-12 min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-surface-container-high/40 flex flex-col items-center text-center animate-pulse">
          <div className="w-24 h-24 rounded-full bg-surface-container-high mb-4"></div>
          <div className="h-6 w-48 bg-surface-container-high rounded-full mb-2"></div>
          <div className="h-4 w-32 bg-surface-container-high rounded-full mb-6"></div>
          <div className="w-full space-y-3">
            <div className="h-12 bg-surface-container rounded-2xl w-full"></div>
            <div className="h-12 bg-surface-container rounded-2xl w-full"></div>
            <div className="h-12 bg-surface-container rounded-2xl w-full"></div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-secondary text-sm">
            <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
            <span>Cargando datos del perfil ciudadano...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full pt-16 pb-24 md:pb-12 min-h-screen bg-surface flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 pt-4 pb-8 space-y-4">
        
        {/* Cabecera del perfil */}
        <section className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-surface-container-high/40 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10 text-center sm:text-left">
            <div className="relative">
              {user.avatarUrl || user.photoUrl ? (
                <img
                  alt={user.name || 'Foto de perfil'}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20 shadow-md"
                  src={user.avatarUrl || user.photoUrl}
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-400 flex items-center justify-center ring-4 ring-primary/20 shadow-md overflow-hidden"
                  aria-label="Silueta de usuario predeterminada"
                  title="Avatar predeterminado"
                >
                  <svg
                    className="w-16 h-16 translate-y-1 fill-current text-slate-400 dark:text-slate-400"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-on-primary rounded-full flex items-center justify-center shadow">
                <span className="material-symbols-outlined text-sm">verified</span>
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="font-headline-md text-headline-md text-on-surface font-extrabold truncate">
                    {user.name || 'Vecino de Morón'}
                  </h1>
                  <p className="font-body-md text-body-md text-secondary truncate text-sm mt-0.5">
                    {user.email}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold self-center sm:self-start">
                  <span className="material-symbols-outlined text-xs">shield</span>
                  <span>{user.role === 'admin' ? 'Administrador' : 'Vecino Activo'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 pt-3 border-t border-surface-container-high/60 text-xs text-secondary">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                  <strong className="text-on-surface">{user.locality || 'Morón'}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-sm">phone</span>
                  <span>{user.phone || 'Sin registrar'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-sm">task_alt</span>
                  <strong className="text-on-surface">{userIncidents.length}</strong> reportes realizados
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Selector de pestañas: Mis Datos vs Mis Reportes */}
        <div className="bg-surface-container-high p-1 rounded-2xl flex items-stretch shadow-inner">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`flex-1 py-3 text-center rounded-xl font-title-md text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'perfil'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">person</span>
            <span>Mis Datos</span>
          </button>
          <button
            onClick={() => setActiveTab('reportes')}
            className={`flex-1 py-3 text-center rounded-xl font-title-md text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'reportes'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">assignment</span>
            <span>Mis Reportes ({userIncidents.length})</span>
          </button>
        </div>

        {/* Vista: Datos Personales */}
        {activeTab === 'perfil' && (
          <div className="space-y-4 animate-in fade-in">
            <section className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-surface-container-high/40 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high/60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">badge</span>
                  <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                    Información de la Cuenta
                  </h2>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-primary text-xs font-bold hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Modificar</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface" htmlFor="edit-name">
                      Nombre completo
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-surface-container-low text-on-surface py-2.5 px-3 rounded-xl border border-surface-container-high text-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface" htmlFor="edit-phone">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      id="edit-phone"
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-surface-container-low text-on-surface py-2.5 px-3 rounded-xl border border-surface-container-high text-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface" htmlFor="edit-locality">
                      Localidad de Residencia
                    </label>
                    <select
                      id="edit-locality"
                      value={editLocality}
                      onChange={(e) => setEditLocality(e.target.value)}
                      className="w-full bg-surface-container-low text-on-surface py-2.5 px-3 rounded-xl border border-surface-container-high text-sm focus:outline-none"
                    >
                      {LOCALITIES.map((loc) => (
                        <option key={loc.id} value={loc.name.split(' (')[0]}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-on-surface" htmlFor="edit-photo">
                        Foto de perfil (URL opcional)
                      </label>
                      {editPhotoUrl && (
                        <button
                          type="button"
                          onClick={() => setEditPhotoUrl('')}
                          className="text-[11px] text-primary hover:underline font-bold"
                        >
                          Usar avatar predeterminado
                        </button>
                      )}
                    </div>
                    <input
                      id="edit-photo"
                      type="url"
                      placeholder="https://ejemplo.com/foto.jpg (dejar vacío para ícono gris)"
                      value={editPhotoUrl}
                      onChange={(e) => setEditPhotoUrl(e.target.value)}
                      className="w-full bg-surface-container-low text-on-surface py-2.5 px-3 rounded-xl border border-surface-container-high text-sm focus:outline-none"
                    />
                    <p className="text-[11px] text-secondary">
                      Si dejás este campo vacío, se usará el avatar predeterminado de silueta gris.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2.5 bg-surface-container text-on-surface rounded-xl text-xs font-bold hover:bg-surface-container-high"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold shadow hover:bg-primary-container"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3.5 bg-surface-container-low rounded-2xl">
                    <span className="text-xs text-secondary uppercase font-bold block mb-0.5">Nombre Completo</span>
                    <span className="font-semibold text-base text-on-surface">{user.name}</span>
                  </div>
                  <div className="p-3.5 bg-surface-container-low rounded-2xl">
                    <span className="text-xs text-secondary uppercase font-bold block mb-0.5">Correo Registrado</span>
                    <span className="font-semibold text-base text-on-surface truncate block">{user.email}</span>
                  </div>
                  <div className="p-3.5 bg-surface-container-low rounded-2xl">
                    <span className="text-xs text-secondary uppercase font-bold block mb-0.5">Teléfono de Contacto</span>
                    <span className="font-semibold text-base text-on-surface">{user.phone || 'No especificado'}</span>
                  </div>
                  <div className="p-3.5 bg-surface-container-low rounded-2xl">
                    <span className="text-xs text-secondary uppercase font-bold block mb-0.5">Barrio / Localidad</span>
                    <span className="font-semibold text-base text-on-surface">{user.locality}</span>
                  </div>
                </div>
              )}
            </section>

            {/* Accesos y opciones */}
            <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-sm border border-surface-container-high/40 flex flex-col gap-2">
              <Link
                to="/nuevo-reporte"
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low transition-colors text-on-surface"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">add_a_photo</span>
                  <span className="font-semibold text-sm">Crear un nuevo reporte de incidencia</span>
                </div>
                <span className="material-symbols-outlined text-secondary">chevron_right</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl">logout</span>
                  <span className="font-semibold text-sm">Cerrar sesión</span>
                </div>
                <span className="material-symbols-outlined text-red-400">chevron_right</span>
              </button>
            </div>
          </div>
        )}

        {/* Vista: Mis Reportes (Historial Exclusivo del Usuario) */}
        {activeTab === 'reportes' && (
          <section className="space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                  Historial de Mis Reclamos
                </h2>
                <p className="text-secondary text-xs">
                  Seguimiento de las solicitudes que creaste en el Municipio de Morón.
                </p>
              </div>
              <Link
                to="/nuevo-reporte"
                className="flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary rounded-full text-xs font-bold shadow hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Nuevo</span>
              </Link>
            </div>

            {userIncidents.length > 0 ? (
              <div className="space-y-3">
                {userIncidents.map((incident) => {
                  const statusColors: Record<string, string> = {
                    pendiente: 'bg-amber-100 text-amber-800 border-amber-300',
                    proceso: 'bg-blue-100 text-blue-800 border-blue-300',
                    resuelto: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                    desestimado: 'bg-rose-100 text-rose-800 border-rose-300',
                  };

                  const statusLabels: Record<string, string> = {
                    pendiente: 'Pendiente de Revisión',
                    proceso: 'En Gestión / Cuadrilla',
                    resuelto: 'Resuelto por Cuadrilla',
                    desestimado: 'Rechazado',
                  };

                  return (
                    <article
                      key={incident.id}
                      className="bg-surface-container-lowest p-4 rounded-3xl shadow-sm border border-surface-container-high/40 space-y-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-primary">
                          #{incident.id}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            statusColors[incident.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {statusLabels[incident.status] || incident.status}
                        </span>
                      </div>

                      <div className="flex gap-3 items-start">
                        {incident.images && incident.images.length > 0 ? (
                          <img
                            alt={incident.title}
                            src={incident.images[0]}
                            className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-surface-container-high"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-2xl">report</span>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className="font-title-md text-on-surface font-bold truncate">
                            {incident.title}
                          </h3>
                          <p className="text-secondary text-sm flex items-center gap-1 mt-0.5 truncate">
                            <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                            <span>{incident.location}</span>
                          </p>
                          <span className="text-xs text-secondary/90 block mt-1">
                            Categoría: <strong className="text-on-surface">{incident.category}</strong> • {incident.timeAgo}
                          </span>
                        </div>
                      </div>

                      {incident.description && (
                        <p className="text-sm text-secondary bg-surface-container-low p-3 rounded-xl line-clamp-2 leading-relaxed">
                          {incident.description}
                        </p>
                      )}

                      {incident.assignedCuadrilla && (
                        <div className="flex items-center gap-2 text-xs text-secondary bg-surface-container-low/70 px-3 py-1.5 rounded-xl">
                          <span className="material-symbols-outlined text-sm text-primary">engineering</span>
                          <span>Asignado a: <strong className="text-on-surface">{incident.assignedCuadrilla}</strong></span>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-surface-container-lowest rounded-3xl border border-surface-container-high/40 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">task</span>
                </div>
                <h3 className="font-title-md text-on-surface font-bold">
                  Todavía no creaste ningún reporte
                </h3>
                <p className="text-secondary text-xs max-w-sm mx-auto">
                  Tus reclamos sobre baches, luminarias rotas o residuos aparecerán aquí para que sigas su estado en tiempo real.
                </p>
                <div className="pt-2">
                  <Link
                    to="/nuevo-reporte"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold shadow hover:bg-primary-container"
                  >
                    <span className="material-symbols-outlined text-sm">add_a_photo</span>
                    <span>Crear mi primer reporte</span>
                  </Link>
                </div>
              </div>
            )}
          </section>
        )}

      </div>

      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 z-50 animate-in fade-in zoom-in-95">
          <span className="material-symbols-outlined text-tertiary-fixed text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
};
