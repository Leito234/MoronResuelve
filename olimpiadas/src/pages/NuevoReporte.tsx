import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useIncidents } from '../context/useIncidents';
import type { UrgencyLevel } from '../types';
import { LocationPickerMap } from '../components/Map/LocationPickerMap';
import { MORON_LOCALITY_COORDS } from '../utils/geoUtils';
import '../styles/NuevoReporte.css';

export const NuevoReporte: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addIncident, user } = useIncidents();

  const catFromUrl = searchParams.get('name') || searchParams.get('cat');
  const [category, setCategory] = useState<string>(catFromUrl || 'Bacheo y Asfalto');
  const [isCatalogDrawerOpen, setIsCatalogDrawerOpen] = useState(false);

  const [address, setAddress] = useState<string>('Belgrano y 9 de Julio, Morón Centro');
  const [locality, setLocality] = useState<string>('Morón Centro');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: -34.6534, lng: -58.6198 });

  const [description, setDescription] = useState<string>(
    'Frente al colegio E.E.S.T N°6 hay un bache profundo que junta agua estancada e impide el paso peatonal seguro.'
  );

  const [urgency, setUrgency] = useState<UrgencyLevel>('Medio');

  const [photos, setPhotos] = useState<string[]>([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB2gsLqrlccO-_mEmxDk_jlHkoDtclKERJbaOBtdMw1gvY4KLimnaGxPfYi_3Gq8f96dXyMfozSnKhxRTEiTNfwgGgbYwdSuH7DhennHyy0FggmiqR0oS2yL2bK32Im8vGBkq0EjD8Y6f7fyPwkStZNphCpiAi_YIh6TtyNCSc6cDt74OAdJ96TxI2oliW_lOLTw2DCIgJg8lBbSrPeKaAZArjPOlAidVO84YxVDCaVLuCWDn2Th9MJ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCVTusek3eMn_sF2N57f2XglhFLEj0e5E348ALSTwCp8_l7GpuulCUvNzU1XCVj42JZ13X5ohrYJ_s6JB0mYj9nIyrPTpOTpCVSs08OOn7Rtf2zh51ttWQAi5csrSYEztXa-YIJ1quECTk-Td5JPwAcOGDwkRoc5JLRM2mCe4w1xlhDQE41bHMZN7ilNA9bunqmYHfn4kez1IwMvY4yb0v6Q92yTr_2E-ZydUgDOmarqLWxX5xhBpBY',
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);


  const handleSelectLocality = (loc: string) => {
    setLocality(loc);
    setAddress(`Av. Rivadavia y San Martín, ${loc}`);
    const locCoords = MORON_LOCALITY_COORDS[loc];
    if (locCoords) {
      setCoords({ lat: locCoords[0], lng: locCoords[1] });
    }
  };

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (photos.length >= 4) {
        alert('Podés adjuntar un máximo de 4 fotografías por reporte.');
        return;
      }
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotos(prev => [...prev, uploadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Por favor detallá brevemente la situación observada.');
      return;
    }

    setIsSubmitting(true);

    try {
      const areaMap: Record<string, 'vialidad' | 'alumbrado' | 'higiene' | 'espacios' | 'seguridad'> = {
        'Bacheo y Asfalto': 'vialidad',
        'Baches en calles': 'vialidad',
        'Alumbrado Público': 'alumbrado',
        'Alumbrado apagado': 'alumbrado',
        'Higiene Urbana': 'higiene',
        'Basura acumulada': 'higiene',
        'Aguas y Cloacas': 'vialidad',
        'Fuga de agua': 'vialidad',
        'Tránsito y Señalización': 'vialidad',
        'Semáforo titilando': 'vialidad',
      };

      const newInc = await addIncident({
        title: category + ' en ' + (address.split(',')[0] || 'vía pública'),
        category,
        categorySlug: category.toLowerCase().replace(/\s+/g, '-'),
        area: areaMap[category] || 'vialidad',
        description,
        location: address,
        locality,
        status: 'pendiente',
        urgency,
        reportedBy: user.name,
        reporterEmail: user.email,
        images: photos,
        assignedCuadrilla: `Cuadrilla Móvil de ${locality}`,
        lat: coords.lat,
        lng: coords.lng,
      });

      setCreatedTicketId(newInc.id);
    } catch (err) {
      console.error('Error al enviar reporte:', err);
      alert('Hubo un inconveniente al registrar el reclamo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setCreatedTicketId(null);
    setDescription('');
    setCategory('Bacheo y Asfalto');
  };

  return (
    <main className="relative w-full pt-16 pb-24 md:pb-12 min-h-screen bg-surface flex flex-col">
      <div className="max-w-2xl mx-auto w-full pb-10">
        <div className="px-margin pt-space-md flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold">
                1
              </span>
              <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
                Paso 1 de 3
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-medium">
              Categoría, Lugar y Fotos
            </span>
          </div>

          <div className="grid grid-cols-3 gap-space-xs w-full">
            <div className="h-1.5 rounded-full bg-primary transition-all duration-300"></div>
            <div className="h-1.5 rounded-full bg-surface-container-highest"></div>
            <div className="h-1.5 rounded-full bg-surface-container-highest"></div>
          </div>

          <div className="mt-space-xs flex flex-col">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface uppercase tracking-tight font-extrabold leading-none">
              Reportar Incidencia
            </h1>
            <p className="font-body-md text-body-md text-secondary mt-1">
              Canal directo con las cuadrillas de servicios urbanos de Morón.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-lg px-margin mt-space-md">
          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <label className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  category
                </span>
                1. ¿Qué problema encontraste?
              </label>
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                Obligatorio
              </span>
            </div>

            <div className="flex gap-space-sm overflow-x-auto pb-space-xs pt-1 -mx-margin px-margin no-scrollbar snap-x">
              {[
                { label: 'Baches en calles', icon: '🕳️' },
                { label: 'Luminaria apagada', icon: '💡' },
                { label: 'Basura acumulada', icon: '🗑️' },
                { label: 'Fuga de agua', icon: '💧' },
                { label: 'Semáforo titilando', icon: '🚦' },
              ].map((chip) => {
                const isSelected = category.includes(chip.label) || category === chip.label;
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setCategory(chip.label)}
                    className={`category-chip snap-start flex-shrink-0 flex items-center gap-space-xs px-3.5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-sm font-bold'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    <span className="text-lg leading-none">{chip.icon}</span>
                    <span className="font-label-md text-label-md whitespace-nowrap">{chip.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsCatalogDrawerOpen(!isCatalogDrawerOpen)}
              className="w-full py-2.5 px-space-md rounded-2xl bg-surface-container flex items-center justify-between text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <span className="flex items-center gap-space-xs font-label-md text-label-md font-semibold text-secondary">
                <span className="material-symbols-outlined text-base">apps</span>
                Explorar catálogo completo de incidencias (20 tipos)
              </span>
              <span className="material-symbols-outlined text-secondary text-base transition-transform duration-200">
                {isCatalogDrawerOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isCatalogDrawerOpen && (
              <div className="flex flex-col gap-space-xs p-space-sm rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container-high animate-in fade-in">
                <span className="font-label-sm text-label-sm text-secondary px-2">
                  MÁS FRECUENTES EN TU ZONA
                </span>
                <div className="grid grid-cols-2 gap-space-xs">
                  {[
                    { name: 'Poda de Árboles', icon: '🌳' },
                    { name: 'Sumideros Tapados', icon: '🌧️' },
                    { name: 'Veredas Rotas', icon: '🧱' },
                    { name: 'Auto Abandonado', icon: '🚗' },
                  ].map((subCat) => (
                    <button
                      key={subCat.name}
                      type="button"
                      onClick={() => {
                        setCategory(subCat.name);
                        setIsCatalogDrawerOpen(false);
                      }}
                      className={`text-left p-2.5 rounded-xl font-body-md text-body-md text-on-surface flex items-center gap-2 transition-colors ${
                        category === subCat.name
                          ? 'bg-primary text-on-primary font-bold'
                          : 'bg-surface-container hover:bg-surface-container-high'
                      }`}
                    >
                      <span>{subCat.icon}</span>
                      <span className="truncate">{subCat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <label className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  location_on
                </span>
                2. ¿Dónde está ubicado?
              </label>
              <span className="font-label-sm text-label-sm text-secondary font-medium">
                Morón, BA
              </span>
            </div>

            <LocationPickerMap
              initialLat={coords.lat}
              initialLng={coords.lng}
              locality={locality}
              address={address}
              onLocationChange={({ lat, lng, locality: detectedLoc }) => {
                setCoords({ lat, lng });
                setLocality(detectedLoc);
                setAddress(`${detectedLoc} (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`);
              }}
              className="h-56"
            />

            <div className="flex flex-col gap-space-xs">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-secondary text-lg pointer-events-none">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-secondary shadow-sm border border-surface-container-high focus:outline-none focus:bg-surface-container-low transition-colors"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ingresá calle, esquina o altura aproximada..."
                />
                {address && (
                  <button
                    type="button"
                    onClick={() => setAddress('')}
                    className="absolute right-3.5 text-secondary hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-base">cancel</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar pt-1">
                <span className="font-label-sm text-label-sm text-secondary whitespace-nowrap mr-1 font-bold">
                  Localidades:
                </span>
                {['Morón Centro', 'Castelar Sur', 'Haedo Norte', 'El Palomar', 'Villa Sarmiento'].map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleSelectLocality(loc)}
                    className="px-2.5 py-1 rounded-lg bg-surface-container font-label-sm text-label-sm font-semibold text-secondary hover:bg-primary-fixed hover:text-on-primary-fixed-variant transition-colors whitespace-nowrap"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <label className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  add_a_photo
                </span>
                3. Evidencia visual
              </label>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                {photos.length} / 4 fotos
              </span>
            </div>

            <div className="flex items-center gap-space-sm p-space-sm rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed shadow-sm">
              <span className="material-symbols-outlined text-tertiary text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                lightbulb
              </span>
              <p className="font-body-md text-body-md text-on-tertiary-fixed font-medium text-xs">
                <strong>Agilizá la resolución:</strong> una foto clara del desperfecto y otra panorámica ayudan a la cuadrilla a llevar las herramientas adecuadas.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-space-sm">
              {photos.map((src, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-2xl overflow-hidden bg-surface-container-high shadow-sm flex flex-col justify-between p-1.5 photo-preview-card border border-surface-container-high"
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={`Evidencia ${index + 1}`}
                    src={src}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                  
                  <div className="relative z-10 flex justify-end">
                    <button
                      type="button"
                      aria-label="Eliminar foto"
                      onClick={() => handleRemovePhoto(index)}
                      className="w-6 h-6 rounded-full bg-inverse-surface/80 text-inverse-on-surface hover:bg-primary flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                  
                  <span className="relative z-10 font-label-sm text-label-sm text-surface-bright font-bold px-1 drop-shadow">
                    {index === 0 ? 'Detalle 🕳️' : index === 1 ? 'Contexto 🏫' : `Foto ${index + 1}`}
                  </span>
                </div>
              ))}

              {photos.length < 4 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col items-center justify-center p-2 text-center hover:bg-surface-container-low transition-colors group active:scale-95 border-2 border-dashed border-outline-variant/60"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-1 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface font-bold">Sumar foto</span>
                  <span className="font-label-sm text-label-sm text-secondary text-[10px] leading-tight mt-0.5">
                    Cámara o Galería
                  </span>
                </button>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAddPhoto}
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-space-sm pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-space-sm rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-center gap-space-xs text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-bold border border-surface-container-high"
              >
                <span className="material-symbols-outlined text-primary text-base">photo_camera</span>
                Tomar con Cámara
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-space-sm rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-center gap-space-xs text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-bold border border-surface-container-high"
              >
                <span className="material-symbols-outlined text-secondary text-base">folder_open</span>
                Desde Galería
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <label htmlFor="reportDescription" className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  edit_note
                </span>
                4. Descripción del reclamo
              </label>
              <span className="font-label-sm text-label-sm text-secondary font-mono">
                {description.length} / 300
              </span>
            </div>

            <div className="relative w-full">
              <textarea
                id="reportDescription"
                className="w-full p-space-md rounded-2xl bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:bg-surface-container-low transition-all resize-none placeholder:text-secondary border border-surface-container-high"
                maxLength={300}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Frente a la escuela hay un bache pronunciado que junta agua e impide el cruce seguro de estudiantes..."
              ></textarea>
            </div>
            <span className="font-label-sm text-label-sm text-secondary -mt-1">
              Consejo: especificá si el problema ocurre sobre la mano derecha o si bloquea una parada de colectivo.
            </span>
          </section>

          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <label className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  warning
                </span>
                5. Nivel de urgencia / Impacto
              </label>
              <span className="font-label-sm text-label-sm text-secondary">Apreciación vecinal</span>
            </div>

            <div className="grid grid-cols-3 gap-space-xs">
              <button
                type="button"
                onClick={() => setUrgency('Bajo')}
                className={`urgency-pill py-3 px-2 rounded-2xl shadow-sm flex flex-col items-center gap-1 border border-surface-container-high ${
                  urgency === 'Bajo' ? 'active-low font-bold' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span className="font-label-md text-label-md font-bold">Bajo</span>
                <span className="font-label-sm text-label-sm text-secondary text-[10px] text-center leading-none">
                  Mantenimiento
                </span>
              </button>

              <button
                type="button"
                onClick={() => setUrgency('Medio')}
                className={`urgency-pill py-3 px-2 rounded-2xl shadow-sm flex flex-col items-center gap-1 border border-surface-container-high ${
                  urgency === 'Medio' ? 'active-mid font-bold' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                <span className="font-label-md text-label-md font-bold">Medio</span>
                <span className="font-label-sm text-label-sm text-on-tertiary-fixed-variant text-[10px] text-center leading-none">
                  Dificulta tránsito
                </span>
              </button>

              <button
                type="button"
                onClick={() => setUrgency('Alto/Riesgo')}
                className={`urgency-pill py-3 px-2 rounded-2xl shadow-sm flex flex-col items-center gap-1 border border-surface-container-high ${
                  urgency === 'Alto/Riesgo' ? 'active-high font-bold' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-md text-label-md font-bold text-primary">Riesgo Alto</span>
                <span className="font-label-sm text-label-sm text-secondary text-[10px] text-center leading-none">
                  Peligro peatón/auto
                </span>
              </button>
            </div>
          </section>

          <div className="flex flex-col gap-space-sm pt-space-xs">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-space-lg rounded-2xl bg-primary text-on-primary font-title-lg text-title-lg font-bold shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-space-sm submit-btn disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-2xl ${isSubmitting ? 'animate-spin' : ''}`}>
                {isSubmitting ? 'hourglass_empty' : 'send'}
              </span>
              <span>{isSubmitting ? 'Registrando en sistema Morón...' : 'Enviar reporte al Municipio'}</span>
            </button>

            <div className="p-space-sm rounded-2xl bg-surface-container-low flex items-start gap-space-sm border border-surface-container-high">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-base font-bold">verified_user</span>
              </div>
              <div className="flex flex-col">
                <p className="font-label-md text-label-md text-on-surface font-bold">
                  Seguimiento oficial e instantáneo
                </p>
                <p className="font-label-sm text-label-sm text-secondary mt-0.5 leading-relaxed text-xs">
                  Al enviar recibirás tu <strong>N° de Ticket Único (Ej: #MOR-2025-8912)</strong> con notificaciones por WhatsApp o app sobre la visita de la cuadrilla municipal.
                </p>
              </div>
            </div>
          </div>

        </form>

        {createdTicketId && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-space-lg shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center mb-space-sm shadow-md">
                <span className="material-symbols-outlined text-4xl font-bold">check</span>
              </div>
              <span className="font-label-md text-label-md font-extrabold uppercase tracking-widest text-primary">
                ¡Incidencia Recibida!
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface font-extrabold mt-1">
                Ticket #{createdTicketId}
              </h3>
              <p className="font-body-md text-body-md text-secondary mt-2 text-sm">
                Tu reporte fue derivado al área de <strong>{category} en {locality}</strong>. La cuadrilla asignada inspeccionará el área en las próximas 48hs.
              </p>

              <div className="w-full my-space-md p-space-sm rounded-2xl bg-surface-container flex items-center justify-between">
                <div className="flex items-center gap-space-xs text-left">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate max-w-[160px]">
                      {address.split(',')[0]}
                    </p>
                    <p className="font-label-sm text-label-sm text-secondary text-[11px]">
                      Estado: En Cola de Cuadrilla
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] font-bold">
                  Pendiente
                </span>
              </div>

              <div className="flex flex-col w-full gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-title-md text-title-md font-bold shadow hover:bg-primary-container transition-colors"
                >
                  Ver estado en 'Mis Reportes'
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2.5 rounded-xl text-secondary font-label-md text-label-md font-semibold hover:bg-surface-container transition-colors"
                >
                  Cargar otro reporte
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};
