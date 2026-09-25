import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MORON_CENTER, getClosestLocality } from '../../utils/geoUtils';

interface LocationPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (coords: { lat: number; lng: number; locality: string }) => void;
  locality?: string;
  address?: string;
  className?: string;
}

const pickerPinIcon = L.divIcon({
  html: `
    <div class="relative flex flex-col items-center justify-center cursor-grab active:cursor-grabbing" style="transform: translate(-50%, -100%);">
      <span class="absolute -bottom-1 w-6 h-6 rounded-full bg-primary/40 animate-ping"></span>
      <div class="w-11 h-11 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-2xl border-2 border-white">
        <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">location_on</span>
      </div>
      <div class="w-3 h-3 rotate-45 -mt-1.5 bg-primary border-r-2 border-b-2 border-white shadow-sm"></div>
    </div>
  `,
  className: 'custom-picker-pin',
  iconSize: [44, 52],
  iconAnchor: [22, 52],
});

const MapClickHandler: React.FC<{
  onCoordsSelected: (lat: number, lng: number) => void;
}> = ({ onCoordsSelected }) => {
  useMapEvents({
    click(e) {
      onCoordsSelected(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapPanHelper: React.FC<{
  coords: [number, number];
}> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, map.getZoom(), { duration: 0.8 });
  }, [coords, map]);
  return null;
};

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  initialLat,
  initialLng,
  onLocationChange,
  locality = 'Morón Centro',
  address = '',
  className = 'h-52',
}) => {
  const [position, setPosition] = useState<[number, number]>(() => {
    if (initialLat && initialLng) return [initialLat, initialLng];
    return MORON_CENTER;
  });
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const markerRef = useRef<L.Marker | null>(null);

  const handleCoordsSelected = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    const detectedLocality = getClosestLocality(lat, lng);
    onLocationChange({ lat, lng, locality: detectedLocality });
  };

  const handleMarkerDragEnd = () => {
    const marker = markerRef.current;
    if (marker) {
      const latlng = marker.getLatLng();
      handleCoordsSelected(latlng.lat, latlng.lng);
    }
  };

  const handleGetGps = () => {
    setIsLocating(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('Geolocalización no soportada por el navegador.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        handleCoordsSelected(latitude, longitude);
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS error:', err);
        handleCoordsSelected(MORON_CENTER[0], MORON_CENTER[1]);
        setGpsError('No se pudo acceder al GPS. Se centró en Morón Centro.');
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden shadow-sm border border-surface-container-high bg-surface-container-low flex flex-col justify-between ${className}`}>
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[1000] flex items-center justify-between pointer-events-none gap-2">
        <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/95 backdrop-blur-md font-label-sm text-label-sm font-bold text-on-surface flex items-center gap-1.5 shadow-sm border border-surface-container-high pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span>Hacé clic o arrastrá el pin</span>
        </span>

        <span className="px-2.5 py-0.5 rounded-lg bg-inverse-surface/85 text-inverse-on-surface font-label-sm text-label-sm shadow pointer-events-auto font-semibold">
          {locality}
        </span>
      </div>

      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-[1000] flex items-center justify-between pointer-events-none gap-2">
        <div className="bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface px-2.5 py-1 rounded-xl text-xs font-label-sm truncate max-w-[200px] pointer-events-auto shadow">
          {address || `${position[0].toFixed(4)}, ${position[1].toFixed(4)}`}
        </div>

        <button
          type="button"
          onClick={handleGetGps}
          disabled={isLocating}
          title="Detectar ubicación GPS actual"
          className="px-3 py-1.5 rounded-xl bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md font-bold flex items-center gap-1 shadow-md transition-colors pointer-events-auto active:scale-95 disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-sm ${isLocating ? 'animate-spin' : ''}`}>
            {isLocating ? 'progress_activity' : 'my_location'}
          </span>
          <span>{isLocating ? 'Buscando...' : 'GPS Actual'}</span>
        </button>
      </div>

      {gpsError && (
        <div className="absolute top-11 left-2.5 right-2.5 z-[1000] bg-error-container text-on-error-container text-xs px-2.5 py-1 rounded-lg shadow font-medium">
          {gpsError}
        </div>
      )}

      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapPanHelper coords={position} />
        <MapClickHandler onCoordsSelected={handleCoordsSelected} />

        <Marker
          position={position}
          icon={pickerPinIcon}
          draggable={true}
          ref={markerRef}
          eventHandlers={{
            dragend: handleMarkerDragEnd,
          }}
        />
      </MapContainer>
    </div>
  );
};
