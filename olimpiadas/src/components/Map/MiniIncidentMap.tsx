import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Incident } from '../../types';
import { getIncidentCoords } from '../../utils/geoUtils';

interface MiniIncidentMapProps {
  incident: Incident;
  className?: string;
}

const miniPinIcon = L.divIcon({
  html: `
    <div class="relative flex flex-col items-center justify-center cursor-pointer" style="transform: translate(-50%, -100%);">
      <span class="absolute -bottom-1 w-5 h-5 rounded-full bg-primary/40 animate-ping"></span>
      <div class="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-lg border-2 border-white">
        <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">location_on</span>
      </div>
      <div class="w-2 h-2 rotate-45 -mt-1 bg-primary border-r border-b border-white"></div>
    </div>
  `,
  className: 'custom-mini-pin',
  iconSize: [32, 38],
  iconAnchor: [16, 38],
});

export const MiniIncidentMap: React.FC<MiniIncidentMapProps> = ({
  incident,
  className = 'h-36',
}) => {
  const coords = getIncidentCoords(incident);

  return (
    <div className={`w-full rounded-2xl overflow-hidden relative shadow-inner border border-surface-container-high ${className}`}>
      <div className="absolute top-2 left-2 z-[1000] bg-surface/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-title-md text-on-surface shadow flex items-center gap-1.5 border border-surface-container-high">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        <span>Geolocalización Confirmada</span>
      </div>

      <MapContainer
        center={coords}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <Marker position={coords} icon={miniPinIcon}>
          <Popup>
            <div className="text-xs font-body-md">
              <strong className="text-primary font-bold">#{incident.id}</strong>
              <p className="mt-0.5">{incident.location}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
