import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIncidents } from '../context/useIncidents';
import { EmergencyModal, type EmergencyCallInfo } from '../components/EmergencyModal';
import '../styles/Inicio.css';

export const Inicio: React.FC = () => {
  const { user, incidents } = useIncidents();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [showFaqModal, setShowFaqModal] = useState<boolean>(false);
  const [emergencyModalInfo, setEmergencyModalInfo] = useState<EmergencyCallInfo | null>(null);

  const handleOpenEmergencyCall = (info: EmergencyCallInfo) => {
    try {
      window.location.href = `tel:${info.number}`;
    } catch {
      // Ignora fallo de protocolo si no hay app tel registrada
    }
    setEmergencyModalInfo(info);
  };

  const userIncidents = React.useMemo(() => {
    if (!user || !user.email) return [];
    const emailLower = user.email.toLowerCase().trim();
    const nameLower = (user.name || '').toLowerCase().trim();
    return incidents.filter(
      i => (i.reporterEmail && i.reporterEmail.toLowerCase().trim() === emailLower) ||
           (i.reportedBy && i.reportedBy.toLowerCase().trim() === nameLower)
    );
  }, [incidents, user]);

  const activeUserIncident = userIncidents.find(
    i => i.status === 'pendiente' || i.status === 'proceso'
  );

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => (prev === id ? null : id));
  };

  const getStepProgressWidth = (step: number = 3) => {
    switch (step) {
      case 1: return '0%';
      case 2: return '33%';
      case 3: return '66%';
      case 4: return '100%';
      default: return '66%';
    }
  };

  return (
    <main className="relative w-full pt-16 pb-24 md:pb-12 min-h-screen bg-surface flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-space-md py-space-md space-y-space-lg">
        <section className="flex items-center justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container-high/40">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-headline-md text-headline-md text-on-surface truncate">
                Hola, {user?.name || 'Vecino de Morón'}
              </h1>
              <span className="text-xl animate-bounce">👋</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                {user ? 'verified' : 'public'}
              </span>
              <span className="font-label-sm text-label-sm text-secondary truncate">
                {user
                  ? (user.role === 'inspector' ? 'Personal Municipal • Mesa de Control' : `Vecino Activo • ${user.locality} / Morón`)
                  : 'Portal Ciudadano de Participación Urbana • Morón'}
              </span>
            </div>
          </div>
          
          {user ? (
            <div className="flex items-center gap-1.5 bg-primary-fixed/60 text-on-primary-fixed px-3 py-1 rounded-full shrink-0">
              <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
              <span className="font-label-sm text-label-sm font-bold">Verificado</span>
            </div>
          ) : (
            <Link
              to="/acceso"
              className="flex items-center gap-1.5 bg-primary text-on-primary px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-primary-container transition-all shrink-0 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              <span>Ingresar</span>
            </Link>
          )}
        </section>

        <section className="relative overflow-hidden rounded-2xl hero-banner-gradient p-space-lg text-on-primary shadow-md">
          <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none">
            <span className="material-symbols-outlined hero-campaign-icon">campaign</span>
          </div>
          
          <div className="relative z-10 flex flex-col space-y-space-md">
            <div className="inline-flex items-center gap-1.5 bg-on-primary/15 backdrop-blur-md px-2.5 py-1 rounded-full w-fit">
              <span className="material-symbols-outlined text-sm">flash_on</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
                Respuesta Morón 24/7
              </span>
            </div>
            
            <div className="space-y-1">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary leading-tight">
                ¿Viste algo en la calle que deba arreglarse?
              </h2>
              <p className="font-body-md text-body-md text-on-primary/85 max-w-lg">
                Tu foto geolocalizada alerta al instante a la cuadrilla de tu barrio. Cuidemos Morón juntos.
              </p>
            </div>
            
            <div className="pt-1">
              <Link
                to="/nuevo-reporte"
                className="inline-flex items-center justify-center gap-2 bg-on-primary text-primary font-title-md text-title-md px-space-lg py-3.5 rounded-xl shadow-lg hover:bg-surface-container-lowest active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  add_a_photo
                </span>
                <span>Reportar Incidencia Ahora</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Reclamo en curso del usuario si existe */}
        {activeUserIncident ? (
          <section className="space-y-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-primary-container animate-ping"></span>
                <h3 className="font-title-lg text-title-lg text-on-surface">Mi Reclamo en Curso</h3>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-bold">
                #{activeUserIncident.id}
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-space-md space-y-space-md shadow-sm border border-surface-container-high/40">
              <div className="flex gap-3">
                {activeUserIncident.images.length > 0 ? (
                  <img
                    className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-sm"
                    alt={activeUserIncident.title}
                    src={activeUserIncident.images[0]}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-surface-container flex items-center justify-center text-primary text-2xl shrink-0">
                    <span className="material-symbols-outlined text-3xl">construction</span>
                  </div>
                )}
                
                <div className="flex flex-col justify-between min-w-0 flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-semibold">
                        {activeUserIncident.category}
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary">
                        {activeUserIncident.timeAgo}
                      </span>
                    </div>
                    <h4 className="font-title-md text-title-md text-on-surface truncate mt-1">
                      {activeUserIncident.title}
                    </h4>
                    <p className="font-body-md text-body-md text-secondary flex items-center gap-1 mt-0.5 truncate">
                      <span className="material-symbols-outlined text-sm text-primary">pin_drop</span>
                      {activeUserIncident.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="relative flex justify-between items-start">
                  <div className="absolute top-3.5 left-4 right-4 timeline-track -z-0">
                    <div
                      className="timeline-progress"
                      style={{ width: getStepProgressWidth(activeUserIncident.timeline?.currentStep) }}
                    ></div>
                  </div>

                  <div className="flex flex-col items-center text-center z-10 w-1/4">
                    <div className="step-node rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs shadow-sm font-bold">
                      <span className="material-symbols-outlined text-sm">done</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface font-bold mt-1.5">
                      Recibido
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary scale-90">
                      {activeUserIncident.timeline?.receivedAt || '10:14 hs'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center z-10 w-1/4">
                    <div className={`step-node rounded-full flex items-center justify-center text-xs shadow-sm font-bold ${
                      (activeUserIncident.timeline?.currentStep || 1) >= 2
                        ? 'bg-primary-container text-on-primary'
                        : 'bg-surface-container-high text-secondary'
                    }`}>
                      {(activeUserIncident.timeline?.currentStep || 1) >= 2 ? (
                        <span className="material-symbols-outlined text-sm">done</span>
                      ) : (
                        '2'
                      )}
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface font-bold mt-1.5">
                      Revisión
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary scale-90">
                      {activeUserIncident.timeline?.reviewedAt || '11:05 hs'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center z-10 w-1/4">
                    <div className={`step-node rounded-full flex items-center justify-center text-xs shadow-md font-bold ${
                      activeUserIncident.timeline?.currentStep === 3
                        ? 'bg-tertiary text-on-tertiary active'
                        : (activeUserIncident.timeline?.currentStep || 1) > 3
                        ? 'bg-primary-container text-on-primary'
                        : 'bg-surface-container-high text-secondary'
                    }`}>
                      {activeUserIncident.timeline?.currentStep === 3 ? (
                        <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                      ) : (activeUserIncident.timeline?.currentStep || 1) > 3 ? (
                        <span className="material-symbols-outlined text-sm">done</span>
                      ) : (
                        '3'
                      )}
                    </div>
                    <span className="font-label-sm text-label-sm text-tertiary font-bold mt-1.5">
                      Cuadrilla
                    </span>
                    <span className="font-label-sm text-label-sm text-tertiary font-bold scale-90">
                      {activeUserIncident.timeline?.dispatchedAt || 'En viaje'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center z-10 w-1/4">
                    <div className={`step-node rounded-full flex items-center justify-center text-xs font-semibold ${
                      activeUserIncident.timeline?.currentStep === 4
                        ? 'bg-primary-container text-on-primary'
                        : 'bg-surface-container-high text-secondary'
                    }`}>
                      {activeUserIncident.timeline?.currentStep === 4 ? (
                        <span className="material-symbols-outlined text-sm">done_all</span>
                      ) : (
                        '4'
                      )}
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary mt-1.5">
                      Resuelto
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary scale-90">
                      {activeUserIncident.timeline?.estimatedResolution || 'Estimado 17h'}
                    </span>
                  </div>
                </div>

                {activeUserIncident.assignedCuadrilla && (
                  <div className="mt-4 bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-base">engineering</span>
                      <span className="font-label-sm text-label-sm text-secondary font-medium">
                        {activeUserIncident.assignedCuadrilla}
                      </span>
                    </div>
                    <Link to="/perfil" className="font-label-sm text-label-sm text-primary font-bold hover:underline">
                      Ver mi reporte
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {/* Sección de Mis Reportes (Acceso directo a su propio historial) */}
        <section className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container-high/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">assignment</span>
              </div>
              <div>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  Mis Reportes
                </h3>
                <p className="font-body-md text-secondary text-xs">
                  {userIncidents.length === 1
                    ? 'Tenés 1 reporte registrado'
                    : userIncidents.length > 1
                    ? `Tenés ${userIncidents.length} reportes registrados`
                    : 'Aún no tenés reclamos activos'}
                </p>
              </div>
            </div>

            <Link
              to="/perfil"
              className="px-3.5 py-2 rounded-xl bg-surface-container text-primary font-title-md text-xs font-bold hover:bg-surface-container-high flex items-center gap-1 transition-colors"
            >
              <span>Ver mi historial</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </div>
        </section>

        <section className="bg-surface-container-low p-space-md rounded-2xl space-y-space-sm border border-surface-container-high/60">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-xl">fmd_bad</span>
            <h3 className="font-title-md text-title-md font-bold">¿Emergencia en Vía Pública?</h3>
          </div>
          <p className="font-body-md text-body-md text-secondary">
            Para riesgo de vida, cables caídos con tensión o siniestros graves, comunicate de forma directa e inmediata.
          </p>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() =>
                handleOpenEmergencyCall({
                  number: '911',
                  label: '911 Policía y Emergencias',
                  subtitle: 'Central de Emergencias 24hs',
                  description: 'Para riesgo de vida, siniestros graves o delitos en curso en el partido de Morón.',
                  badge: 'Emergencia Crítica 24hs',
                  icon: 'local_police',
                  colorClass: 'bg-red-600 text-white',
                })
              }
              className="flex items-center justify-center gap-2.5 bg-on-error-container text-on-primary py-3 px-3.5 rounded-2xl font-title-md text-base shadow-sm active:scale-95 hover:opacity-95 transition-all text-center"
            >
              <span className="material-symbols-outlined text-xl">local_police</span>
              <span className="font-bold">911 Policía</span>
            </button>
            <button
              type="button"
              onClick={() =>
                handleOpenEmergencyCall({
                  number: '107',
                  label: '107 SAME Morón',
                  subtitle: 'Atención Médica y Ambulancias',
                  description: 'Servicio de Emergencias Médicas y despacho de ambulancias en el partido de Morón.',
                  badge: 'Salud y Ambulancias 24hs',
                  icon: 'medical_services',
                  colorClass: 'bg-primary text-white',
                })
              }
              className="flex items-center justify-center gap-2.5 bg-primary-container text-on-primary py-3 px-3.5 rounded-2xl font-title-md text-base shadow-sm active:scale-95 hover:opacity-95 transition-all text-center"
            >
              <span className="material-symbols-outlined text-xl">medical_services</span>
              <span className="font-bold">107 SAME Morón</span>
            </button>
          </div>
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() =>
                handleOpenEmergencyCall({
                  number: '08005556676',
                  label: 'Línea Municipal OIR Morón',
                  subtitle: 'Atención Ciudadana y Reclamos',
                  description: 'Oficina de Información y Reclamos Vecinales del Municipio de Morón.',
                  badge: 'Línea Gratuita Vecinal',
                  icon: 'support_agent',
                  colorClass: 'bg-secondary text-white',
                })
              }
              className="font-label-md text-sm text-secondary flex items-center gap-1.5 hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-base">support_agent</span>
              <span>Línea Municipal OIR: 0800-555-6676</span>
            </button>
            <span className="font-label-sm text-xs text-secondary">Lun a Vie 8-20h</span>
          </div>
        </section>

        <section className="space-y-space-sm pt-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-xl">gavel</span>
            <h3 className="font-title-lg text-title-lg text-on-surface">Términos del Servicio Ciudadano</h3>
          </div>
          <p className="font-body-md text-body-md text-secondary">
            Conocé las pautas operativas, tiempos de respuesta y resguardo de datos según las normativas del Municipio de Morón.
          </p>

          <div className="space-y-2">
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container-high/40 accordion-item">
              <button
                className="w-full p-space-md flex items-center justify-between text-left text-on-surface accordion-trigger"
                onClick={() => toggleAccordion('legal-1')}
                type="button"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="material-symbols-outlined text-primary text-xl shrink-0">fact_check</span>
                  <span className="font-title-md text-title-md font-bold truncate">
                    Compromiso de Veracidad Cívica
                  </span>
                </div>
                <span className={`material-symbols-outlined text-secondary accordion-icon ${openAccordion === 'legal-1' ? 'rotated' : ''}`}>
                  expand_more
                </span>
              </button>
              {openAccordion === 'legal-1' && (
                <div className="px-space-md pb-space-md text-secondary space-y-2 bg-surface-container-lowest animate-in fade-in duration-200">
                  <p className="font-body-md text-body-md">
                    Al registrar una solicitud o reclamo, el vecino declara bajo fe de juramento que la información, fotografías y coordenadas geográficas aportadas corresponden fielmente a una situación real observada en el ejido del partido de Morón.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-xl flex items-start gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-base mt-0.5">info</span>
                    <p className="font-label-sm text-label-sm">
                      Las denuncias falsas reiteradas o material difamatorio podrán implicar la suspensión preventiva del perfil de usuario y la desestimación de turnos.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container-high/40 accordion-item">
              <button
                className="w-full p-space-md flex items-center justify-between text-left text-on-surface accordion-trigger"
                onClick={() => toggleAccordion('legal-2')}
                type="button"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="material-symbols-outlined text-primary text-xl shrink-0">shield</span>
                  <span className="font-title-md text-title-md font-bold truncate">
                    Protección de Datos Personales (Ley 25.326)
                  </span>
                </div>
                <span className={`material-symbols-outlined text-secondary accordion-icon ${openAccordion === 'legal-2' ? 'rotated' : ''}`}>
                  expand_more
                </span>
              </button>
              {openAccordion === 'legal-2' && (
                <div className="px-space-md pb-space-md text-secondary space-y-2 bg-surface-container-lowest animate-in fade-in duration-200">
                  <p className="font-body-md text-body-md">
                    El Municipio de Morón garantiza la confidencialidad de la identidad y datos de contacto de las y los denunciantes. La información recabada sólo es accesible por inspectores comunales y jefaturas de cuadrilla asignadas a la resolución de la tarea técnica.
                  </p>
                  <p className="font-body-md text-body-md">
                    El usuario podrá en cualquier momento solicitar el acceso, rectificación o supresión de sus datos registrados mediante solicitud formal ante la Dirección de Modernización Municipal.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container-high/40 accordion-item">
              <button
                className="w-full p-space-md flex items-center justify-between text-left text-on-surface accordion-trigger"
                onClick={() => toggleAccordion('legal-3')}
                type="button"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="material-symbols-outlined text-primary text-xl shrink-0">schedule</span>
                  <span className="font-title-md text-title-md font-bold truncate">
                    Tiempos de Respuesta Estimados (SLA)
                  </span>
                </div>
                <span className={`material-symbols-outlined text-secondary accordion-icon ${openAccordion === 'legal-3' ? 'rotated' : ''}`}>
                  expand_more
                </span>
              </button>
              {openAccordion === 'legal-3' && (
                <div className="px-space-md pb-space-md text-secondary space-y-2 bg-surface-container-lowest animate-in fade-in duration-200">
                  <p className="font-body-md text-body-md">
                    Los plazos de resolución varían de acuerdo a la complejidad técnica y las condiciones climáticas operativas:
                  </p>
                  <ul className="space-y-1.5 font-label-sm text-label-sm">
                    <li className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg">
                      <span className="font-bold text-on-surface">Alumbrado público descompuesto:</span>
                      <span className="text-primary font-semibold">24 a 72 hs hábiles</span>
                    </li>
                    <li className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg">
                      <span className="font-bold text-on-surface">Microbasurales e higiene urbana:</span>
                      <span className="text-primary font-semibold">12 a 48 hs</span>
                    </li>
                    <li className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg">
                      <span className="font-bold text-on-surface">Bacheo y cinta asfáltica:</span>
                      <span className="text-primary font-semibold">5 a 10 días hábiles</span>
                    </li>
                    <li className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg">
                      <span className="font-bold text-on-surface">Desobstrucción de sumideros pluviales:</span>
                      <span className="text-primary font-semibold">24 a 48 hs</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container-high/40 accordion-item">
              <button
                className="w-full p-space-md flex items-center justify-between text-left text-on-surface accordion-trigger"
                onClick={() => toggleAccordion('legal-4')}
                type="button"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="material-symbols-outlined text-primary text-xl shrink-0">emergency</span>
                  <span className="font-title-md text-title-md font-bold truncate">
                    Protocolo de Derivación ante Riesgo Vital
                  </span>
                </div>
                <span className={`material-symbols-outlined text-secondary accordion-icon ${openAccordion === 'legal-4' ? 'rotated' : ''}`}>
                  expand_more
                </span>
              </button>
              {openAccordion === 'legal-4' && (
                <div className="px-space-md pb-space-md text-secondary space-y-2 bg-surface-container-lowest animate-in fade-in duration-200">
                  <p className="font-body-md text-body-md">
                    Esta plataforma digital <strong className="text-on-surface">no reemplaza las vías de auxilio rápido</strong>. Toda alerta que mencione incendios, personas heridas, escapes de gas u hostilidades directas es derivada automáticamente a los organismos de Seguridad Ciudadana y Defensa Civil de Morón.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-high/60 p-space-md rounded-2xl text-center space-y-2 border border-surface-container-highest">
          <span className="material-symbols-outlined text-3xl text-secondary">help_outline</span>
          <h4 className="font-title-md text-title-md text-on-surface">¿Tenés dudas sobre tu gestión barrial?</h4>
          <p className="font-body-md text-body-md text-secondary max-w-sm mx-auto">
            Consultá las guías vecinales de poda, recolección de voluminosos y pagos de tasas comunales.
          </p>
          <div className="pt-1">
            <button
              onClick={() => setShowFaqModal(true)}
              className="bg-surface-container-lowest text-on-surface px-5 py-2.5 rounded-xl font-title-md text-title-md shadow-sm hover:bg-surface-container active:bg-surface-container transition-colors"
              type="button"
            >
              Preguntas Frecuentes de Vecinos
            </button>
          </div>
        </section>

      </div>

      {showFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-on-surface">Preguntas Frecuentes</h3>
              <button
                onClick={() => setShowFaqModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container text-secondary flex items-center justify-center hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-surface-container-low rounded-xl">
                <h5 className="font-title-md text-primary font-bold">¿Cómo sé si mi reclamo fue atendido?</h5>
                <p className="text-secondary mt-1">Podés seguir el número de ticket asignado en la pestaña 'Inicio' o recibir notificaciones vía WhatsApp.</p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl">
                <h5 className="font-title-md text-primary font-bold">¿Qué es una UGC?</h5>
                <p className="text-secondary mt-1">Son las Unidades de Gestión Comunitaria del Municipio de Morón que coordinan los móviles de cuadrilla barriales.</p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl">
                <h5 className="font-title-md text-primary font-bold">¿Puedo adjuntar más fotos luego?</h5>
                <p className="text-secondary mt-1">Sí, desde el detalle de tu solicitud podés agregar fotos de contexto o comentarios para los inspectores.</p>
              </div>
            </div>
            <button
              onClick={() => setShowFaqModal(false)}
              className="w-full py-3 bg-primary text-on-primary rounded-xl font-title-md text-title-md"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <EmergencyModal
        info={emergencyModalInfo}
        onClose={() => setEmergencyModalInfo(null)}
      />
    </main>
  );
};
