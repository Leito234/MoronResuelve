export type IncidentArea = 'vialidad' | 'alumbrado' | 'higiene' | 'espacios' | 'seguridad' | 'all';

export type IncidentStatus = 'pendiente' | 'proceso' | 'resuelto' | 'desestimado';

export type UrgencyLevel = 'Bajo' | 'Medio' | 'Alto/Riesgo';

export interface IncidentCategory {
  id: string;
  slug: string;
  number: string;
  title: string;
  description: string;
  icon: string;
  iconFilled?: boolean;
  sla: string;
  area: 'vialidad' | 'alumbrado' | 'higiene' | 'espacios' | 'seguridad';
  colorBadgeClass: string;
  iconContainerClass: string;
}

export interface IncidentTimeline {
  receivedAt: string;
  reviewedAt: string;
  dispatchedAt: string;
  estimatedResolution: string;
  currentStep: 1 | 2 | 3 | 4;
}

export interface Incident {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  area: 'vialidad' | 'alumbrado' | 'higiene' | 'espacios' | 'seguridad';
  description: string;
  location: string;
  locality: string;
  status: IncidentStatus;
  urgency: UrgencyLevel;
  timeAgo: string;
  reportedBy: string;
  reporterEmail: string;
  reporterPhone?: string;
  images: string[];
  assignedCuadrilla?: string;
  operatorInCharge?: string;
  inspectorNotes?: string;
  timeline?: IncidentTimeline;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  locality: string;
  level: number;
  points: number;
  isVerified: boolean;
  role: 'vecino' | 'inspector';
}
