import type { Incident } from '../types';

export const MORON_CENTER: [number, number] = [-34.6534, -58.6198];

export const MORON_LOCALITY_COORDS: Record<string, [number, number]> = {
  'Morón Centro': [-34.6534, -58.6198],
  'Castelar Norte': [-34.6465, -58.6380],
  'Castelar Sur': [-34.6620, -58.6435],
  'Haedo': [-34.6442, -58.5964],
  'Haedo Norte': [-34.6420, -58.5950],
  'Haedo Sur': [-34.6480, -58.5980],
  'El Palomar': [-34.5989, -58.5886],
  'Morón Sur': [-34.6720, -58.6150],
  'Villa Sarmiento': [-34.6360, -58.5790],
};

// Devuelve coordenadas exactas o aproximadas con leve dispersión para evitar superposición
export function getIncidentCoords(incident: Pick<Incident, 'id' | 'lat' | 'lng' | 'locality' | 'location'>): [number, number] {
  if (
    typeof incident.lat === 'number' &&
    typeof incident.lng === 'number' &&
    !isNaN(incident.lat) &&
    !isNaN(incident.lng) &&
    incident.lat !== 0 &&
    incident.lng !== 0
  ) {
    return [incident.lat, incident.lng];
  }

  let baseCoords = MORON_CENTER;
  const locKey = Object.keys(MORON_LOCALITY_COORDS).find(k =>
    (incident.locality && incident.locality.toLowerCase().includes(k.toLowerCase())) ||
    (incident.location && incident.location.toLowerCase().includes(k.toLowerCase()))
  );

  if (locKey) {
    baseCoords = MORON_LOCALITY_COORDS[locKey];
  }

  const seedStr = incident.id || incident.location || 'seed';
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }

  const offsetLat = ((Math.abs(hash) % 100) - 50) * 0.00018;
  const offsetLng = ((Math.abs(hash * 31) % 100) - 50) * 0.00018;

  return [baseCoords[0] + offsetLat, baseCoords[1] + offsetLng];
}

export function getClosestLocality(lat: number, lng: number): string {
  let closest = 'Morón Centro';
  let minDistance = Infinity;

  for (const [name, coords] of Object.entries(MORON_LOCALITY_COORDS)) {
    const dLat = coords[0] - lat;
    const dLng = coords[1] - lng;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < minDistance) {
      minDistance = dist;
      closest = name;
    }
  }

  return closest;
}
