import type { Incident, IncidentCategory, IncidentStatus, UserProfile } from '../types';
import { CATEGORIES_20, INITIAL_INCIDENTS, INITIAL_USER, LOCALITIES } from '../data/mockData';


const PRIMARY_API_URL = '/api';
const FALLBACK_API_URL = 'http://localhost:5006/api';

const TOKEN_KEY = 'moron_resuelve_token';
const USERS_STORAGE_KEY = 'moron_resuelve_registered_users';
const INCIDENTS_STORAGE_KEY = 'moron_resuelve_incidents';

export const isTokenValid = (token: string | null): boolean => {
  if (!token || typeof token !== 'string' || !token.trim()) {
    return false;
  }

  // 1. Si es un token JWT estándar (formato xxx.yyy.zzz con 3 segmentos)
  const parts = token.split('.');
  if (parts.length === 3) {
    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const parsed = JSON.parse(jsonPayload);
      if (parsed.exp) {
        const nowSeconds = Math.floor(Date.now() / 1000);
        if (nowSeconds >= parsed.exp) {
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  // 2. Si es un token simulado/offline (formato: moron-token-${id}-${timestamp})
  if (token.startsWith('moron-token-')) {
    const segments = token.split('-');
    const timestampStr = segments[segments.length - 1];
    const timestamp = parseInt(timestampStr, 10);
    if (!isNaN(timestamp)) {
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp > ONE_DAY_MS) {
        return false;
      }
      return true;
    }
    return true;
  }

  return token.length > 8;
};

export const getRoleFromToken = (token: string | null): 'admin' | 'inspector' | 'vecino' | null => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  // 1. Si es un JWT estándar (formato xxx.yyy.zzz con 3 segmentos)
  const parts = token.split('.');
  if (parts.length === 3) {
    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const parsed = JSON.parse(jsonPayload);
      const roleClaim =
        parsed.role ||
        parsed['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        (parsed.isAdmin === 'true' || parsed.isAdmin === true ? 'admin' : null);

      if (roleClaim === 'admin' || roleClaim === 'inspector' || roleClaim === 'vecino') {
        return roleClaim;
      }
    } catch {
      return null;
    }
  }

  // 2. Si es token simulado administrativo
  if (token.startsWith('moron-token-999-')) {
    return 'admin';
  }

  return null;
};

export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!isTokenValid(token)) {
    if (token) {
      removeToken();
    }
    return null;
  }
  return token;
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};


async function safeFetch(endpoint: string, options: RequestInit = {}, timeoutMs = 2500): Promise<Response | null> {
  const urlsToTry = [
    `${PRIMARY_API_URL}${endpoint}`,
    `${FALLBACK_API_URL}${endpoint}`,
  ];

  for (const url of urlsToTry) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);
      return res;
    } catch {
      // Ignora fallo de conexión y prueba siguiente endpoint
    }
  }

  return null;
}

const getStoredUsers = (): UserProfile[] => {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // Ignora error de parseo y usa lista predeterminada
    }
  }
  const defaultList: UserProfile[] = [
    { id: 1, name: 'Juan García', email: 'al_garcia@eest6.edu.ar', phone: '11-2345-6789', locality: 'Castelar Sur', isVerified: true, role: 'vecino' },
    { id: 2, name: 'Operaciones Municipales Morón', email: 'operaciones@moron.gob.ar', phone: '11-4489-7777', locality: 'Morón Centro', isVerified: true, role: 'inspector' },
    { id: 3, name: 'Mariana Rossi', email: 'm.rossi@gmail.com', phone: '11-5555-1234', locality: 'Castelar Sur', isVerified: true, role: 'vecino' },
    { id: 4, name: 'Carlos Domínguez', email: 'carlos.d@moron.gob.ar', phone: '11-4444-9876', locality: 'Morón Sur', isVerified: true, role: 'inspector' },
  ];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultList));
  return defaultList;
};

const saveStoredUsers = (users: UserProfile[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const getStoredIncidents = (): Incident[] => {
  const raw = localStorage.getItem(INCIDENTS_STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // Ignora error de parseo y usa incidentes iniciales
    }
  }
  localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(INITIAL_INCIDENTS));
  return INITIAL_INCIDENTS;
};

const saveStoredIncidents = (incidents: Incident[]): void => {
  localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(incidents));
};

export interface LoginResponse {
  token: string;
  usuario: UserProfile;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    if (!email || !password) {
      throw new Error('Por favor ingresá tu correo electrónico y contraseña.');
    }

    const res = await safeFetch('/auth/login', {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });

    if (res) {
      if (res.ok) {
        const data: LoginResponse = await res.json();
        setToken(data.token);
        return data;
      }
      if (res.status === 401 || res.status === 400) {
        const errorText = await res.text();
        let msg = 'Credenciales inválidas.';
        try {
          const parsed = JSON.parse(errorText);
          if (parsed.message) msg = parsed.message;
        } catch {
          if (errorText) msg = errorText;
        }
        throw new Error(msg);
      }
    }

    // Modo sin conexión: autentica localmente preservando el rol según dominio oficial
    const isInspectorEmail = email.toLowerCase().includes('@moron.gob.ar');
    const existingUsers = getStoredUsers();
    let matchedUser = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!matchedUser) {
      matchedUser = {
        id: existingUsers.length + 1,
        name: isInspectorEmail ? 'Operaciones Municipales Morón' : email.split('@')[0],
        email,
        phone: '11-4489-7777',
        locality: 'Morón Centro',
        isVerified: true,
        role: isInspectorEmail ? 'inspector' : 'vecino',
      };
      saveStoredUsers([...existingUsers, matchedUser]);
    } else {
      if (isInspectorEmail && matchedUser.role !== 'inspector') {
        matchedUser = { ...matchedUser, role: 'inspector' };
        saveStoredUsers(existingUsers.map(u => u.email === matchedUser?.email ? matchedUser : u));
      }
    }

    const mockToken = `moron-token-${matchedUser.id}-${Date.now()}`;
    setToken(mockToken);
    return {
      token: mockToken,
      usuario: matchedUser,
    };
  },

  register: async (userData: {
    nombre: string;
    email: string;
    password: string;
    telefono?: string;
    localidad: string;
  }): Promise<LoginResponse> => {
    if (!userData.nombre || !userData.email || !userData.password) {
      throw new Error('Por favor completá todos los campos obligatorios.');
    }

    const res = await safeFetch('/auth/registro', {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(userData),
    });

    if (res) {
      if (res.ok) {
        const data: LoginResponse = await res.json();
        setToken(data.token);
        return data;
      }
      if (res.status === 409 || res.status === 400) {
        const errorText = await res.text();
        let msg = 'Error al registrar usuario.';
        try {
          const parsed = JSON.parse(errorText);
          if (parsed.message) msg = parsed.message;
        } catch {
          if (errorText) msg = errorText;
        }
        throw new Error(msg);
      }
    }

    const isInspectorEmail = userData.email.toLowerCase().includes('@moron.gob.ar');
    const existingUsers = getStoredUsers();
    const newUser: UserProfile = {
      id: existingUsers.length + 1,
      name: userData.nombre,
      email: userData.email,
      phone: userData.telefono || '11-2345-6789',
      locality: userData.localidad || 'Morón Centro',
      isVerified: true,
      role: isInspectorEmail ? 'inspector' : 'vecino',
    };

    saveStoredUsers([...existingUsers, newUser]);
    const mockToken = `moron-token-${newUser.id}-${Date.now()}`;
    setToken(mockToken);
    return {
      token: mockToken,
      usuario: newUser,
    };
  },

  logout: async (): Promise<void> => {
    try {
      await safeFetch('/auth/logout', {
        method: 'POST',
        headers: getHeaders(true),
      }, 1200);
    } catch {
      // Ignora fallo de red y prosigue con la invalidación local
    } finally {
      removeToken();
    }
  },

  getProfile: async (id: number): Promise<UserProfile> => {
    const res = await safeFetch(`/usuarios/${id}`, {
      headers: getHeaders(),
    });

    if (res && res.ok) {
      return await res.json();
    }

    const users = getStoredUsers();
    const found = users.find(u => u.id === id);
    return found || INITIAL_USER;
  },

  updateProfile: async (
    id: number,
    data: { nombre: string; telefono?: string; localidad: string }
  ): Promise<UserProfile> => {
    const res = await safeFetch(`/usuarios/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (res && res.ok) {
      return await res.json();
    }

    const users = getStoredUsers();
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        return {
          ...u,
          name: data.nombre,
          phone: data.telefono || u.phone,
          locality: data.localidad,
        };
      }
      return u;
    });
    saveStoredUsers(updatedUsers);
    const updated = updatedUsers.find(u => u.id === id);
    return updated || INITIAL_USER;
  },
};

export const usersApi = {
  getAll: async (): Promise<UserProfile[]> => {
    const res = await safeFetch('/usuarios', {
      headers: getHeaders(),
    });

    if (res && res.ok) {
      const data = await res.json();
      saveStoredUsers(data);
      return data;
    }

    return getStoredUsers();
  },

  updateRole: async (id: number, role: 'vecino' | 'inspector'): Promise<UserProfile> => {
    const res = await safeFetch(`/usuarios/${id}/rol`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });

    if (res && res.ok) {
      return await res.json();
    }

    const users = getStoredUsers();
    let updated: UserProfile | undefined;
    const nextUsers = users.map(u => {
      if (u.id === id) {
        updated = { ...u, role };
        return updated;
      }
      return u;
    });

    saveStoredUsers(nextUsers);
    if (!updated) {
      throw new Error('Usuario no encontrado');
    }
    return updated;
  },
};

export const incidentsApi = {
  getAll: async (params?: {
    status?: string;
    area?: string;
    search?: string;
  }): Promise<Incident[]> => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.area && params.area !== 'all') query.append('area', params.area);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await safeFetch(`/incidencias${queryString}`, {
      headers: getHeaders(),
    });

    if (res && res.ok) {
      const data = await res.json();
      saveStoredIncidents(data);
      return data;
    }

    let list = getStoredIncidents();
    if (params?.status && params.status !== 'all') {
      list = list.filter(i => i.status === params.status);
    }
    if (params?.area && params.area !== 'all') {
      list = list.filter(i => i.area === params.area);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getById: async (id: string): Promise<Incident> => {
    const res = await safeFetch(`/incidencias/${id}`, {
      headers: getHeaders(),
    });

    if (res && res.ok) {
      return await res.json();
    }

    const list = getStoredIncidents();
    const found = list.find(i => i.id === id);
    if (!found) {
      throw new Error('Incidencia no encontrada');
    }
    return found;
  },

  create: async (data: Omit<Incident, 'id' | 'timeAgo'>): Promise<Incident> => {
    const res = await safeFetch('/incidencias', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (res && res.ok) {
      return await res.json();
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newIncident: Incident = {
      ...data,
      id: `MOR-${randomNum}`,
      timeAgo: 'Recién',
      timeline: {
        receivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' hs',
        reviewedAt: 'Pendiente',
        dispatchedAt: 'En espera',
        estimatedResolution: '48hs hábiles',
        currentStep: 1,
      },
    };

    const currentList = getStoredIncidents();
    saveStoredIncidents([newIncident, ...currentList]);
    return newIncident;
  },

  updateStatus: async (
    id: string,
    updateData: {
      status: IncidentStatus;
      assignedCuadrilla?: string;
      operatorInCharge?: string;
      inspectorNotes?: string;
    }
  ): Promise<Incident> => {
    const res = await safeFetch(`/incidencias/${id}/estado`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });

    if (res && res.ok) {
      return await res.json();
    }

    const stepMap: Record<IncidentStatus, 1 | 2 | 3 | 4> = {
      pendiente: 1,
      proceso: 3,
      resuelto: 4,
      desestimado: 1,
    };

    const currentList = getStoredIncidents();
    let updatedIncident: Incident | null = null;

    const nextList = currentList.map(item => {
      if (item.id === id) {
        updatedIncident = {
          ...item,
          status: updateData.status,
          assignedCuadrilla: updateData.assignedCuadrilla || item.assignedCuadrilla,
          inspectorNotes: updateData.inspectorNotes || item.inspectorNotes,
          operatorInCharge: updateData.operatorInCharge || item.operatorInCharge,
          timeline: item.timeline
            ? {
              ...item.timeline,
              currentStep: stepMap[updateData.status] || item.timeline.currentStep,
              dispatchedAt: updateData.status === 'proceso' ? 'Despachado' : item.timeline.dispatchedAt,
              estimatedResolution: updateData.status === 'resuelto' ? 'Resuelto' : item.timeline.estimatedResolution,
            }
            : undefined,
        };
        return updatedIncident;
      }
      return item;
    });

    saveStoredIncidents(nextList);
    if (!updatedIncident) {
      throw new Error('Incidencia no encontrada');
    }
    return updatedIncident;
  },

  delete: async (id: string): Promise<void> => {
    const res = await safeFetch(`/incidencias/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (res && res.ok) {
      return;
    }

    const currentList = getStoredIncidents();
    saveStoredIncidents(currentList.filter(i => i.id !== id));
  },
};

export const categoriesApi = {
  getAll: async (params?: { area?: string; search?: string }): Promise<IncidentCategory[]> => {
    const query = new URLSearchParams();
    if (params?.area && params.area !== 'all') query.append('area', params.area);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await safeFetch(`/categorias${queryString}`, {
      headers: getHeaders(false),
    });

    if (res && res.ok) {
      return await res.json();
    }

    let list = CATEGORIES_20;
    if (params?.area && params.area !== 'all') {
      list = list.filter(c => c.area === params.area);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getBySlug: async (slug: string): Promise<IncidentCategory> => {
    const res = await safeFetch(`/categorias/${slug}`, {
      headers: getHeaders(false),
    });

    if (res && res.ok) {
      return await res.json();
    }

    const found = CATEGORIES_20.find(c => c.slug === slug);
    if (!found) {
      throw new Error('Categoría no encontrada');
    }
    return found;
  },
};

export const localitiesApi = {
  getAll: async (): Promise<string[]> => {
    const res = await safeFetch('/localidades', {
      headers: getHeaders(false),
    });

    if (res && res.ok) {
      return await res.json();
    }

    return LOCALITIES.map(l => l.name);
  },
};
