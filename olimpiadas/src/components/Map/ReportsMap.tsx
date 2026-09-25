import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Incident, IncidentStatus } from '../../types';
import { MORON_CENTER, MORON_BOUNDS, getIncidentCoords } from '../../utils/geoUtils';

interface ReportsMapProps {
  incidents: Incident[];
  onSelectIncident?: (incident: Incident) => void;
  selectedIncidentId?: string | null;
  className?: string;
}

const createIncidentIcon = (status: IncidentStatus, isSelected = false) => {
  let bgColor = '#dc2626';
  let iconName = 'warning';
  let isPulse = true;

  if (status === 'proceso') {
    bgColor = '#2563eb';
    iconName = 'engineering';
    isPulse = false;
  } else if (status === 'resuelto') {
    bgColor = '#059669';
    iconName = 'check';
    isPulse = false;
  } else if (status === 'desestimado') {
    bgColor = '#64748b';
    iconName = 'close';
    isPulse = false;
  }

  const pulseRing = isPulse
    ? `<span class="absolute -bottom-1 w-6 h-6 rounded-full animate-ping opacity-60" style="background-color: ${bgColor}"></span>`
    : '';

  const selectedRing = isSelected
    ? `<span class="absolute -inset-1 rounded-2xl ring-4 ring-primary animate-pulse"></span>`
    : '';

  const html = `
    <div class="relative flex flex-col items-center justify-center cursor-pointer group" style="transform: translate(-50%, -100%);">
      ${pulseRing}
      ${selectedRing}
      <div class="relative flex items-center justify-center w-9 h-9 rounded-2xl shadow-xl border-2 border-white transition-transform group-hover:scale-115" style="background-color: ${bgColor}; color: #ffffff;">
        <span class="material-symbols-outlined text-lg leading-none select-none">${iconName}</span>
      </div>
      <div class="w-2.5 h-2.5 rotate-45 -mt-1 shadow-sm border-r border-b border-white" style="background-color: ${bgColor};"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-incident-pin',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
};

const MapCameraHelper: React.FC<{
  incidents: Incident[];
  selectedIncidentId?: string | null;
}> = ({ incidents, selectedIncidentId }) => {
  const map = useMap();
  const hasFittedRef = useRef(false);

  useEffect(() => {
    if (selectedIncidentId) {
      const selected = incidents.find(i => i.id === selectedIncidentId);
      if (selected) {
        const coords = getIncidentCoords(selected);
        map.flyTo(coords, 16, { duration: 1.2 });
      }
    }
  }, [selectedIncidentId, incidents, map]);

  useEffect(() => {
    if (incidents.length > 0 && !hasFittedRef.current && !selectedIncidentId) {
      const bounds = L.latLngBounds(incidents.map(i => getIncidentCoords(i)));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        hasFittedRef.current = true;
      }
    }
  }, [incidents, map, selectedIncidentId]);

  return null;
};

export const ReportsMap: React.FC<ReportsMapProps> = ({
  incidents,
  onSelectIncident,
  selectedIncidentId,
  className = 'h-[500px]',
}) => {
  const mapRef = useRef<L.Map | null>(null);

  const incidentCoordsList = useMemo(() => {
    return incidents.map(incident => ({
      incident,
      coords: getIncidentCoords(incident),
      icon: createIncidentIcon(incident.status, incident.id === selectedIncidentId),
    }));
  }, [incidents, selectedIncidentId]);

  const handleCenterMoron = () => {
    if (mapRef.current) {
      mapRef.current.flyTo(MORON_CENTER, 13, { duration: 1 });
    }
  };

  const handleFitAll = () => {
    if (mapRef.current && incidents.length > 0) {
      const bounds = L.latLngBounds(incidents.map(i => getIncidentCoords(i)));
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden shadow-md border border-surface-container-high bg-surface-container-low ${className}`}>
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none gap-2">
        <div className="bg-surface/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-surface-container-high pointer-events-auto flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
          <span className="font-label-sm text-label-sm font-bold text-on-surface">
            {incidents.length} {incidents.length === 1 ? 'Reclamo en mapa' : 'Reclamos en mapa'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={handleFitAll}
            title="Ajustar vista a todos los reportes"
            className="h-9 px-3 rounded-full bg-surface/90 hover:bg-surface text-secondary hover:text-on-surface backdrop-blur-md shadow-md border border-surface-container-high text-xs font-title-md font-semibold flex items-center gap-1 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">zoom_out_map</span>
            <span className="hidden sm:inline">Ver todos</span>
          </button>
          <button
            type="button"
            onClick={handleCenterMoron}
            title="Centrar en el Municipio de Morón"
            className="h-9 px-3 rounded-full bg-primary text-on-primary shadow-md hover:bg-primary-container text-xs font-title-md font-bold flex items-center gap-1 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">near_me</span>
            <span className="hidden sm:inline">Morón</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-3 left-3 z-[1000] bg-surface/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-md border border-surface-container-high pointer-events-auto hidden sm:flex items-center gap-3 text-xs font-label-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <span className="text-secondary font-medium">Pendiente</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span className="text-secondary font-medium">En Cuadrilla</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span className="text-secondary font-medium">Resuelto</span>
        </div>
      </div>

      <MapContainer
        center={MORON_CENTER}
        zoom={13}
        minZoom={12}
        maxZoom={18}
        maxBounds={MORON_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contribuyentes'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapCameraHelper
          incidents={incidents}
          selectedIncidentId={selectedIncidentId}
        />

        {incidentCoordsList.map(({ incident, coords, icon }) => (
          <Marker
            key={incident.id}
            position={coords}
            icon={icon}
          >
            <Popup className="custom-incident-popup" minWidth={260} maxWidth={320}>
              <div className="p-1 space-y-2">
                <div className="flex items-center justify-between gap-2 border-b border-surface-container-high/60 pb-1.5">
                  <span className="font-bold text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                    #{incident.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      incident.status === 'pendiente'
                        ? 'bg-red-100 text-red-800'
                        : incident.status === 'proceso'
                        ? 'bg-blue-100 text-blue-800'
                        : incident.status === 'resuelto'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {incident.status === 'proceso' ? 'En Cuadrilla' : incident.status}
                  </span>
                </div>

                {incident.images && incident.images.length > 0 && (
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-surface-container">
                    <img
                      src={incident.images[0]}
                      alt={incident.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-sm text-on-surface leading-tight line-clamp-2">
                    {incident.title}
                  </h4>
                  <p className="text-xs text-secondary mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-primary shrink-0">location_on</span>
                    <span className="truncate">{incident.location}</span>
                  </p>
                  <p className="text-[11px] text-secondary/80 mt-0.5">
                    {incident.locality} • {incident.timeAgo}
                  </p>
                </div>

                <div className="pt-1 flex items-center justify-between gap-2">
                  <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded text-secondary font-medium">
                    Urgencia: <strong className="text-on-surface">{incident.urgency}</strong>
                  </span>

                  {onSelectIncident && (
                    <button
                      type="button"
                      onClick={() => onSelectIncident(incident)}
                      className="px-2.5 py-1 bg-primary text-on-primary hover:bg-primary-container text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span>Ver Ficha</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
