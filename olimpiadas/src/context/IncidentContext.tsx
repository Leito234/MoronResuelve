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

  const ADMIN_USER: UserProfile = {
    id: 999,
    name: 'Administración Municipal Morón',
    email: 'admin@moron.gob.ar',
    phone: '11-4489-7777',
    locality: 'Morón Centro',
    isVerified: true,
    role: 'admin',
  };

  const isAdmin = user.role === 'admin' || user.role === 'inspector';

  // Función auxiliar de hashing SHA-256 (Web Crypto API) para no exponer contraseñas en texto plano en el bundle
  const hashStringSHA256 = async (val: string): Promise<string> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(val);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return '';
    }
  };

  const loginAdmin = async (username: string, pass: string): Promise<boolean> => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    // 1. Soporte para variables de entorno Vite (VITE_ADMIN_USER y VITE_ADMIN_PASS)
    const envAdminUser = (import.meta.env.VITE_ADMIN_USER as string | undefined)?.trim().toLowerCase();
    const envAdminPass = (import.meta.env.VITE_ADMIN_PASS as string | undefined)?.trim();

    const isUserValid = envAdminUser
      ? cleanUser === envAdminUser
      : (cleanUser === 'admin' || cleanUser === 'admin@moron.gob.ar');

    // 2. Verificación criptográfica: se compara contra el hash SHA-256 para evitar credenciales en texto plano en el bundle
    const passHash = await hashStringSHA256(cleanPass);
    // Hash SHA-256 precalculado para la clave administrativa por defecto
    const DEFAULT_PASS_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

    const isPassValid = envAdminPass ? cleanPass === envAdminPass : passHash === DEFAULT_PASS_HASH;

    if (isUserValid && isPassValid) {
      setUser(ADMIN_USER);
      localStorage.setItem('moron_resuelve_user', JSON.stringify(ADMIN_USER));
      return true;
    }
    throw new Error('Credenciales inválidas. Verificá usuario y contraseña.');
  };

  const logoutAdmin = () => {
    const saved = localStorage.getItem('moron_resuelve_registered_users');
    let fallbackUser = INITIAL_USER;
    if (saved) {
      try {
        const users = JSON.parse(saved);
        if (Array.isArray(users) && users.length > 0) {
          fallbackUser = users[0];
        }
      } catch {
        // Usa initial user
      }
    }
    setUser({ ...fallbackUser, role: 'vecino' });
    localStorage.setItem('moron_resuelve_user', JSON.stringify({ ...fallbackUser, role: 'vecino' }));
  };

  const toggleUserRole = () => {
    setUser(prev => ({
      ...prev,
      role: prev.role === 'vecino' ? 'admin' : 'vecino',
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
        isAdmin,
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
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};
