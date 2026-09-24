import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/useIncidents';
import { LOCALITIES } from '../data/mockData';
import '../styles/Acceso.css';

export const Acceso: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useIncidents();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>(user.email);
  const [loginPassword, setLoginPassword] = useState<string>('••••••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [rememberSession, setRememberSession] = useState<boolean>(true);

  // Register form state
  const [regName, setRegName] = useState<string>('');
  const [regLastName, setRegLastName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regUgc, setRegUgc] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  // Modals
  const [showLegalModal, setShowLegalModal] = useState<boolean>(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);
  const [recoveryEmail, setRecoveryEmail] = useState<string>('');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      alert('Ingresá tu correo electrónico.');
      return;
    }

    const isInspector = loginEmail.includes('@moron.gob.ar');
    setUser(prev => ({
      ...prev,
      email: loginEmail,
      role: isInspector ? 'inspector' : 'vecino',
    }));

    showToast(`Sesión iniciada con éxito como ${isInspector ? 'Inspector Municipal' : 'Vecino'}`);
    setTimeout(() => {
      navigate(isInspector ? '/gestion' : '/');
    }, 800);
  };

  const handleActivateInspectorMode = () => {
    setLoginEmail('operaciones@moron.gob.ar');
    setUser(prev => ({
      ...prev,
      role: 'inspector',
      email: 'operaciones@moron.gob.ar',
    }));
    showToast('Modo Personal Municipal / Inspector habilitado');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      alert('Por favor completá los campos obligatorios.');
      return;
    }
    if (!termsAccepted) {
      alert('Debes aceptar los Términos y Condiciones del Municipio de Morón.');
      return;
    }

    setUser({
      name: `${regName} ${regLastName}`.trim(),
      email: regEmail,
      phone: regPhone ? `+54 9 11 ${regPhone}` : '11-2345-6789',
      locality: regUgc || 'Morón Centro',
      level: 1,
      points: 100,
      isVerified: true,
      role: 'vecino',
    });

    showToast('¡Cuenta vecinal creada con éxito! Bienvenido a Morón Resuelve.');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleAcceptTermsAndClose = () => {
    setTermsAccepted(true);
    setShowLegalModal(false);
  };

  return (
    <main className="relative w-full pt-16 pb-24 md:pb-12 min-h-screen bg-surface flex flex-col">
      <div className="max-w-xl mx-auto w-full pb-8">
        
        {/* Top Civic Badge & Atmospheric Brand Glow */}
        <div className="relative overflow-hidden bg-surface-container-lowest px-4 pt-6 pb-8 shadow-sm rounded-b-3xl border-b border-surface-container-high/40">
          <div className="absolute -right-12 -top-16 w-52 h-52 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-10 top-24 w-40 h-40 bg-secondary-fixed/50 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Municipality Crest / Identity */}
            <div className="flex items-center justify-center w-20 h-20 bg-surface-container rounded-2xl shadow-inner mb-3 p-2 border border-surface-container-high">
              <img
                alt="Escudo Oficial Municipio de Morón"
                className="w-full h-full object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5XiRE4R9E-yBJPzIG1mEEoSLRWu__ruKwxTxb4AdkGIG1LbFXDCB2XjNYRaC0zjIIKr9GbZCCQuBtWoda4u6ogn1ioAwUTgkGfqKeqsaACHWJl1J99JmRVbHFOrpyZWYUMVKcyjFl0NDeHATzIqQWzkpnCebigSTMW70qq04zhlKxPhgIDq7HRUhKupKtBZXEADd6eIkKjIAD0iovK9rTpetIhXWW-x1COHKpZ7KCpIaMZ5Zcf4M58oLSm-uNRF_5qg"
              />
            </div>

            {/* Editorial Urgency Typography */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
                Gestión Urbana Morón 2025
              </span>
            </div>

            <h1 className="font-headline-xl-mobile md:font-headline-lg text-headline-xl-mobile md:text-headline-lg text-on-surface tracking-tight mb-2 uppercase font-extrabold">
              Tu voz en cada rincón de{' '}
              <span className="text-primary underline decoration-primary/30 decoration-4 underline-offset-4">
                Morón
              </span>
            </h1>
            
            <p className="font-body-md text-body-md text-secondary max-w-sm">
              Plataforma oficial de participación vecinal, seguimiento geolocalizado e intervención barrial inmediata.
            </p>

            {/* Editorial Stats Strip */}
            <div className="grid grid-cols-3 gap-2 w-full mt-5 pt-4 bg-surface-container-low rounded-2xl p-3 border border-surface-container-high/40">
              <div className="flex flex-col items-center">
                <span className="font-headline-md text-headline-md text-primary font-extrabold">94.2%</span>
                <span className="font-label-sm text-label-sm text-secondary text-center text-[10px]">
                  Intervenciones Morón
                </span>
              </div>
              <div className="flex flex-col items-center border-x border-surface-container-high/60 px-1">
                <span className="font-headline-md text-headline-md text-on-surface font-extrabold">48hs</span>
                <span className="font-label-sm text-label-sm text-secondary text-center text-[10px]">
                  Plazo Cuadrillas
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-headline-md text-headline-md text-tertiary font-extrabold">14 UGC</span>
                <span className="font-label-sm text-label-sm text-secondary text-center text-[10px]">
                  Atención Barrial
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Segmented Tab Bar Switcher */}
        <div className="px-4 mt-5">
          <div className="bg-surface-container-high p-1 rounded-2xl flex items-stretch shadow-inner">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-3 text-center rounded-xl font-title-md text-title-md transition-all duration-200 flex items-center justify-center gap-2 ${
                authMode === 'login'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">login</span>
              Iniciar Sesión
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-3 text-center rounded-xl font-title-md text-title-md transition-all duration-200 flex items-center justify-center gap-2 ${
                authMode === 'register'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              Crear Cuenta
            </button>
          </div>
        </div>

        {/* Forms Section */}
        <div className="px-4 mt-4">
          
          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-4 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-surface-container-high/40 animate-in fade-in"
            >
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-bold">
                  Acceso Vecinal
                </span>
                <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                  Bienvenido de vuelta
                </h2>
                <p className="font-body-md text-body-md text-secondary text-xs">
                  Ingresá con tu cuenta para gestionar tus solicitudes barriales.
                </p>
              </div>

              {/* Field: Correo */}
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="font-label-md text-label-md text-on-surface font-bold" htmlFor="login-email">
                  Correo Electrónico
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-secondary text-xl">
                    alternate_email
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="ejemplo@moron.gob.ar o tu mail"
                    className="w-full bg-surface-container-low text-on-surface placeholder:text-outline py-3.5 pl-11 pr-4 rounded-2xl font-body-md text-body-md border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>

              {/* Field: Contraseña */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-bold" htmlFor="login-password">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRecoveryModal(true)}
                    className="font-label-sm text-label-sm text-primary hover:underline font-semibold"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-secondary text-xl">
                    lock
                  </span>
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-surface-container-low text-on-surface placeholder:text-outline py-3.5 pl-11 pr-11 rounded-2xl font-body-md text-body-md border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 text-secondary p-1 hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showLoginPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Checkbox Remember */}
              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="w-5 h-5 rounded-lg accent-primary bg-surface-container-low"
                />
                <span className="font-body-md text-body-md text-on-surface text-sm">
                  Recordar mi sesión en este dispositivo
                </span>
              </label>

              {/* Primary CTA */}
              <button
                type="submit"
                className="w-full py-4 mt-2 bg-primary-container text-on-primary rounded-2xl font-headline-md text-headline-md tracking-wide shadow-md flex items-center justify-center gap-2 hover:bg-primary active:scale-98 transition-all"
              >
                <span>Ingresar como Vecino</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              {/* Quick Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow h-px bg-surface-container-highest"></div>
                <span className="flex-shrink mx-4 font-label-sm text-label-sm text-secondary uppercase font-bold">
                  o canal operativo
                </span>
                <div className="flex-grow h-px bg-surface-container-highest"></div>
              </div>

              {/* Inspector / Municipal Staff Access */}
              <button
                type="button"
                onClick={handleActivateInspectorMode}
                className="w-full py-3.5 px-4 bg-inverse-surface text-inverse-on-surface rounded-2xl font-title-md text-title-md flex items-center justify-between shadow-sm hover:bg-black active:scale-98 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-tertiary-fixed text-2xl">
                    shield_person
                  </span>
                  <div className="text-left">
                    <div className="font-title-md text-title-md text-inverse-on-surface leading-none font-bold">
                      Personal Municipal / Inspector
                    </div>
                    <div className="font-label-sm text-label-sm text-secondary-fixed-dim mt-0.5 text-xs">
                      UGC, Tránsito, Higiene Urbana & Cuadrillas
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-sm text-secondary-fixed-dim">
                  navigate_next
                </span>
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authMode === 'register' && (
            <form
              onSubmit={handleRegister}
              className="flex flex-col gap-4 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-surface-container-high/40 animate-in fade-in"
            >
              <div className="flex flex-col gap-1">
                <div className="inline-flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  <span className="font-label-md text-label-md uppercase tracking-wider font-bold">
                    Alta Única Ciudadana
                  </span>
                </div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                  Creá tu cuenta barrial
                </h2>
                <p className="font-body-md text-body-md text-secondary text-xs">
                  Tus datos garantizan que las cuadrillas atiendan y validen tus reclamos en tu barrio.
                </p>
              </div>

              {/* Name & Last Name (2 Cols) */}
              <div className="grid grid-cols-2 gap-3 mt-1">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-bold" htmlFor="reg-name">
                    Nombre
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ej. Lucía"
                    className="w-full bg-surface-container-low text-on-surface placeholder:text-outline py-3 px-3.5 rounded-2xl font-body-md text-body-md border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-bold" htmlFor="reg-lastname">
                    Apellido
                  </label>
                  <input
                    id="reg-lastname"
                    type="text"
                    required
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="Ej. Morales"
                    className="w-full bg-surface-container-low text-on-surface placeholder:text-outline py-3 px-3.5 rounded-2xl font-body-md text-body-md border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>

              {/* Field: Correo */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-bold" htmlFor="reg-email">
                  Correo Electrónico
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-secondary text-xl">
                    mail
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nombre.vecino@gmail.com"
                    className="w-full bg-surface-container-low text-on-surface placeholder:text-outline py-3.5 pl-11 pr-4 rounded-2xl font-body-md text-body-md border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                <span className="font-label-sm text-label-sm text-secondary px-1 text-xs">
                  Te enviaremos las confirmaciones de avance de obra y tickets.
                </span>
              </div>

              {/* Field: Teléfono / WhatsApp */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-bold" htmlFor="reg-phone">
                  Teléfono / WhatsApp de Contacto
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-3.5 bg-surface-container text-on-surface font-title-md text-title-md rounded-2xl shadow-inner border border-surface-container-high font-bold text-sm">
                    +54 9 11
                  </span>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="2345-6789"
                    className="w-full bg-surface-container-low text-on-surface placeholder:text-outline py-3.5 px-3.5 rounded-2xl font-body-md text-body-md border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>

              {/* Field: UGC o Localidad Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-bold" htmlFor="reg-ugc">
                  Tu Localidad / Barrio en Morón
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-secondary text-xl">
                    location_city
                  </span>
                  <select
                    id="reg-ugc"
                    value={regUgc}
                    onChange={(e) => setRegUgc(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface py-3.5 pl-11 pr-8 rounded-2xl font-body-md text-body-md border border-surface-container-high focus:outline-none focus:bg-surface-container-lowest transition-all appearance-none"
                  >
                    <option value="">Seleccioná tu localidad...</option>
                    {LOCALITIES.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3.5 pointer-events-none text-secondary">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-bold" htmlFor="reg-password">
                    Crear Contraseña
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-surface-container-low text-on-surface py-3 px-3.5 rounded-2xl font-body-md text-body-md border border-surface-container-high focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-bold" htmlFor="reg-password-confirm">
                    Confirmar Contraseña
                  </label>
                  <input
                    id="reg-password-confirm"
                    type="password"
                    value={regPasswordConfirm}
                    onChange={(e) => setRegPasswordConfirm(e.target.value)}
                    placeholder="Repetí contraseña"
                    className="w-full bg-surface-container-low text-on-surface py-3 px-3.5 rounded-2xl font-body-md text-body-md border border-surface-container-high focus:outline-none"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="p-3.5 bg-surface-container-low rounded-2xl flex flex-col gap-2 border border-surface-container-high">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded-lg accent-primary bg-surface-container"
                  />
                  <span className="font-body-md text-body-md text-on-surface leading-tight text-xs">
                    Acepto los{' '}
                    <button
                      type="button"
                      onClick={() => setShowLegalModal(true)}
                      className="text-primary font-title-md text-title-md underline inline text-xs font-bold"
                    >
                      Términos y Condiciones de Uso y Privacidad de Datos Ciudadanos
                    </button>{' '}
                    del Municipio de Morón.
                  </span>
                </label>
                <div className="flex items-center gap-1.5 text-secondary px-1 text-[11px]">
                  <span className="material-symbols-outlined text-sm text-tertiary">gavel</span>
                  <span>Conforme a la Ley Nacional de Protección de Datos Personales N° 25.326.</span>
                </div>
              </div>

              {/* Primary Action */}
              <button
                type="submit"
                className="w-full py-4 mt-1 bg-primary-container text-on-primary rounded-2xl font-headline-md text-headline-md tracking-wide shadow-md flex items-center justify-center gap-2 hover:bg-primary active:scale-98 transition-all"
              >
                <span>Completar Registro Vecinal</span>
                <span className="material-symbols-outlined">how_to_reg</span>
              </button>
            </form>
          )}

        </div>

        {/* Trust & Municipal Transparency Strip */}
        <div className="px-4 mt-6">
          <div className="p-4 bg-surface-container rounded-3xl flex flex-col gap-3 border border-surface-container-high">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-primary-fixed text-primary rounded-2xl shrink-0">
                <span className="material-symbols-outlined text-2xl">support_agent</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-secondary uppercase font-bold">
                  Línea Gratuita de Atención al Vecino
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <a
                    className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold"
                    href="tel:08006666766"
                  >
                    0800-666-6766
                  </a>
                  <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm rounded-md font-bold">
                    MORÓN
                  </span>
                </div>
                <span className="font-body-md text-body-md text-secondary mt-1 text-xs">
                  Lunes a Viernes de 8:00 a 20:00 hs | Sábados 9:00 a 13:00 hs
                </span>
              </div>
            </div>
            
            <div className="pt-3 flex items-center justify-between border-t border-surface-container-high/60">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-base text-primary">verified</span>
                <span className="font-label-sm text-label-sm text-xs">
                  Portal Auditado y Abierto Morón Transparente
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-mono">v2.4.0</span>
            </div>
          </div>
        </div>

      </div>

      {/* LEGAL TERMS & CONDITIONS MODAL (Drawer Style) */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in">
          <div className="bg-surface-container-lowest w-full max-w-lg max-h-[85vh] rounded-t-3xl p-6 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-1.5 bg-surface-variant rounded-full mb-3 cursor-pointer"
                onClick={() => setShowLegalModal(false)}
              ></div>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">policy</span>
                <div>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-bold">
                    Términos y Privacidad Ciudadana
                  </h3>
                  <span className="font-label-sm text-label-sm text-secondary text-xs">
                    Municipio de Morón • Secretaría de Modernización
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLegalModal(false)}
                className="p-2 text-secondary hover:text-on-surface rounded-full bg-surface-container-low"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-1 text-on-surface font-body-md text-body-md my-3 py-1 max-h-80 text-xs">
              <div className="bg-surface-container-low p-3.5 rounded-2xl">
                <h4 className="font-title-md text-title-md text-primary mb-1 font-bold">
                  1. Objeto y Alcance del Servicio
                </h4>
                <p className="text-secondary">
                  La plataforma oficial "Morón Resuelve" tiene por finalidad habilitar un canal directo, trazable y georreferenciado entre la ciudadanía del Partido de Morón y las diferentes áreas de servicios públicos municipales (bacheo, luminarias, podas preventivas, higiene urbana, arbolado y emergencias no críticas).
                </p>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-2xl">
                <h4 className="font-title-md text-title-md text-primary mb-1 font-bold">
                  2. Protección de Datos y Confidencialidad
                </h4>
                <p className="text-secondary">
                  En cumplimiento estricto con la Ley Nacional N° 25.326 de Protección de Datos Personales, sus datos identificatorios (Nombre, DNI, Teléfono y Domicilio) no serán publicados abiertamente ni cedidos a terceros. Se utilizarán exclusivamente con fines de verificación de incidencias urbanas y trazabilidad pública municipal.
                </p>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-2xl">
                <h4 className="font-title-md text-title-md text-primary mb-1 font-bold">
                  3. Veracidad de los Reportes y Uso Responsable
                </h4>
                <p className="text-secondary">
                  El usuario se compromete a no subir contenido ofensivo, información falsa o imágenes que vulneren la privacidad de vecinos particulares. La reiteración maliciosa de reportes inexistentes habilitará al Municipio de Morón a la inhabilitación del perfil vecinal.
                </p>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-2xl">
                <h4 className="font-title-md text-title-md text-primary mb-1 font-bold">
                  4. Georreferenciación Automática
                </h4>
                <p className="text-secondary">
                  Al capturar fotografías mediante la aplicación móvil, el usuario concede acceso al sensor GPS de su dispositivo para fijar las coordenadas exactas de la anomalía en el mapa catastral municipal.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleAcceptTermsAndClose}
                className="w-full py-3.5 bg-primary text-on-primary rounded-2xl font-title-md text-title-md shadow-md hover:bg-primary-container active:scale-98 transition-all font-bold"
              >
                Aceptar Términos y Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD RECOVERY MODAL */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined text-2xl">lock_reset</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                Recuperar Acceso
              </h3>
              <p className="font-body-md text-body-md text-secondary mt-1 text-xs">
                Ingresá el correo con el que te diste de alta para enviarte un enlace seguro temporal.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-bold" htmlFor="recovery-email">
                Correo Electrónico
              </label>
              <input
                id="recovery-email"
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                className="w-full bg-surface-container-low text-on-surface py-3 px-3.5 rounded-2xl font-body-md text-body-md border border-surface-container-high focus:outline-none"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowRecoveryModal(false)}
                className="flex-1 py-3 bg-surface-container text-on-surface font-title-md text-title-md rounded-xl hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Enlace de recuperación enviado a tu correo');
                  setShowRecoveryModal(false);
                }}
                className="flex-1 py-3 bg-primary text-on-primary font-title-md text-title-md rounded-xl shadow-sm hover:bg-primary-container"
              >
                Enviar Enlace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Status Notification Toast */}
      {statusNotification && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-full shadow-2xl font-label-md text-label-md flex items-center gap-2 z-50 animate-in fade-in zoom-in-95">
          <span className="material-symbols-outlined text-tertiary-fixed text-lg">check_circle</span>
          <span>{statusNotification}</span>
        </div>
      )}
    </main>
  );
};
