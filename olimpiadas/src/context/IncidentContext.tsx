import React, { useState, useEffect } from 'react';
import type { Incident, IncidentStatus, UserProfile } from '../types';
import { INITIAL_INCIDENTS, INITIAL_USER } from '../data/mockData';
import { IncidentContext } from './IncidentContextInstance';

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('moron_resuelve_incidents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_INCIDENTS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('moron_resuelve_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_USER;
  });

  const [selectedLocality, setSelectedLocality] = useState<string>('Castelar Sur');

  useEffect(() => {
    localStorage.setItem('moron_resuelve_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('moron_resuelve_user', JSON.stringify(user));
  }, [user]);

  const addIncident = (newIncidentData: Omit<Incident, 'id' | 'timeAgo'>): Incident => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const id = `MOR-${randomNum}`;
    const newIncident: Incident = {
      ...newIncidentData,
      id,
      timeAgo: 'Recién',
      timeline: {
        receivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' hs',
        reviewedAt: 'Pendiente',
        dispatchedAt: 'En espera',
        estimatedResolution: '48hs hábiles',
        currentStep: 1,
      },
    };

    setIncidents(prev => [newIncident, ...prev]);

    setUser(prev => ({
      ...prev,
      points: prev.points + 50,
      level: Math.floor((prev.points + 50) / 300) + 1,
    }));

    return newIncident;
  };

  const updateIncidentStatus = (
    id: string,
    status: IncidentStatus,
    assignedCuadrilla?: string,
    notes?: string
  ) => {
    setIncidents(prev =>
      prev.map(item => {
        if (item.id === id) {
          const stepMap: Record<IncidentStatus, 1 | 2 | 3 | 4> = {
            pendiente: 1,
            proceso: 3,
            resuelto: 4,
            desestimado: 1,
          };
          return {
            ...item,
            status,
            assignedCuadrilla: assignedCuadrilla || item.assignedCuadrilla,
            inspectorNotes: notes || item.inspectorNotes,
            timeline: item.timeline
              ? {
                  ...item.timeline,
                  currentStep: stepMap[status] || item.timeline.currentStep,
                  dispatchedAt: status === 'proceso' ? 'Despachado' : item.timeline.dispatchedAt,
                  estimatedResolution: status === 'resuelto' ? 'Resuelto' : item.timeline.estimatedResolution,
                }
              : undefined,
          };
        }
        return item;
      })
    );
  };

  const dismissIncident = (id: string) => {
    setIncidents(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'desestimado' } : item))
    );
  };

  const toggleUserRole = () => {
    setUser(prev => ({
      ...prev,
      role: prev.role === 'vecino' ? 'inspector' : 'vecino',
    }));
  };

  const refreshData = () => {
    const saved = localStorage.getItem('moron_resuelve_incidents');
    if (saved) {
      try {
        setIncidents(JSON.parse(saved));
      } catch {
        setIncidents(INITIAL_INCIDENTS);
      }
    } else {
      setIncidents(INITIAL_INCIDENTS);
    }
  };

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        user,
        selectedLocality,
        setSelectedLocality,
        setUser,
        addIncident,
        updateIncidentStatus,
        dismissIncident,
        toggleUserRole,
        refreshData,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};
