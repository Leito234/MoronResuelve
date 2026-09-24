import React, { createContext } from 'react';
import type { Incident, IncidentStatus, UserProfile } from '../types';

export interface IncidentContextType {
  incidents: Incident[];
  user: UserProfile;
  selectedLocality: string;
  setSelectedLocality: (loc: string) => void;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  addIncident: (newIncident: Omit<Incident, 'id' | 'timeAgo'>) => Incident;
  updateIncidentStatus: (id: string, status: IncidentStatus, assignedCuadrilla?: string, notes?: string) => void;
  dismissIncident: (id: string) => void;
  toggleUserRole: () => void;
  refreshData: () => void;
}

export const IncidentContext = createContext<IncidentContextType | undefined>(undefined);
