import React, { createContext } from 'react';
import type { Incident, IncidentStatus, UserProfile } from '../types';

export interface IncidentContextType {
  incidents: Incident[];
  user: UserProfile;
  selectedLocality: string;
  isLoading: boolean;
  error: string | null;
  setSelectedLocality: (loc: string) => void;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  addIncident: (newIncident: Omit<Incident, 'id' | 'timeAgo'>) => Promise<Incident>;
  updateIncidentStatus: (
    id: string,
    status: IncidentStatus,
    assignedCuadrilla?: string,
    notes?: string
  ) => Promise<void>;
  dismissIncident: (id: string) => Promise<void>;
  toggleUserRole: () => void;
  refreshData: () => Promise<void>;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (data: {
    nombre: string;
    email: string;
    password: string;
    telefono?: string;
    localidad: string;
  }) => Promise<UserProfile>;
  isAdmin: boolean;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  logout: () => void;
}

export const IncidentContext = createContext<IncidentContextType | undefined>(undefined);
