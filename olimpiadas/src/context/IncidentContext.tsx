import React, { useState, useEffect, useCallback } from 'react';
import type { Incident, IncidentStatus, UserProfile } from '../types';
import { INITIAL_INCIDENTS, INITIAL_USER } from '../data/mockData';
import { IncidentContext } from './IncidentContextInstance';
import { incidentsApi, authApi, removeToken } from '../services/api';

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('moron_resuelve_incidents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Ignora error de parseo y usa datos iniciales
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
        // Ignora error de parseo y usa usuario inicial
      }
    }
    return INITIAL_USER;
  });

  const [selectedLocality, setSelectedLocality] = useState<string>('Castelar Sur');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await incidentsApi.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setIncidents(data);
        localStorage.setItem('moron_resuelve_incidents', JSON.stringify(data));
      }
    } catch (err: unknown) {
      console.warn('No se pudo conectar con la API de incidencias, usando datos locales:', err);
      const saved = localStorage.getItem('moron_resuelve_incidents');
      if (saved) {
        try {
          setIncidents(JSON.parse(saved));
        } catch {
          setIncidents(INITIAL_INCIDENTS);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    incidentsApi.getAll()
      .then(data => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setIncidents(data);
          localStorage.setItem('moron_resuelve_incidents', JSON.stringify(data));
        }
      })
      .catch((err: unknown) => {
        console.warn('Usando incidencias locales:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('moron_resuelve_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('moron_resuelve_incidents', JSON.stringify(incidents));
  }, [incidents]);

  const addIncident = async (newIncidentData: Omit<Incident, 'id' | 'timeAgo'>): Promise<Incident> => {
    try {
      const created = await incidentsApi.create(newIncidentData);
      setIncidents(prev => [created, ...prev]);

      setUser(prev => ({
        ...prev,
        points: prev.points + 50,
        level: Math.floor((prev.points + 50) / 300) + 1,
      }));

      return created;
    } catch (err: unknown) {
      console.warn('Fallo guardado en backend, guardando localmente:', err);
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const id = `MOR-${randomNum}`;
      const fallbackIncident: Incident = {
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

      setIncidents(prev => [fallbackIncident, ...prev]);
      setUser(prev => ({
        ...prev,
        points: prev.points + 50,
        level: Math.floor((prev.points + 50) / 300) + 1,
      }));

      return fallbackIncident;
    }
  };

  const updateIncidentStatus = async (
    id: string,
    status: IncidentStatus,
    assignedCuadrilla?: string,
    notes?: string
  ) => {
    try {
      const updated = await incidentsApi.updateStatus(id, {
        status,
        assignedCuadrilla,
        inspectorNotes: notes,
      });

      setIncidents(prev => prev.map(item => (item.id === id ? updated : item)));
    } catch (err: unknown) {
      console.warn('Fallo actualización en backend, actualizando localmente:', err);
      const stepMap: Record<IncidentStatus, 1 | 2 | 3 | 4> = {
        pendiente: 1,
        proceso: 3,
        resuelto: 4,
        desestimado: 1,
      };

      setIncidents(prev =>
        prev.map(item => {
          if (item.id === id) {
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
    }
  };

  const dismissIncident = async (id: string) => {
    await updateIncidentStatus(id, 'desestimado');
  };

  const login = async (email: string, password: string): Promise<UserProfile> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(email, password);
      setUser(response.usuario);
      return response.usuario;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    nombre: string;
    email: string;
    password: string;
    telefono?: string;
    localidad: string;
  }): Promise<UserProfile> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(data);
      setUser(response.usuario);
      return response.usuario;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrarse';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(INITIAL_USER);
  };

  const toggleUserRole = () => {
    setUser(prev => ({
      ...prev,
      role: prev.role === 'vecino' ? 'inspector' : 'vecino',
    }));
  };

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        user,
        selectedLocality,
        isLoading,
        error,
        setSelectedLocality,
        setUser,
        addIncident,
        updateIncidentStatus,
        dismissIncident,
        toggleUserRole,
        refreshData,
        login,
        register,
        logout,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};
