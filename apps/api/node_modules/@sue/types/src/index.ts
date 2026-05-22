export type UserRole = 'admin' | 'administrativos' | 'user';

export type ValidationState = 
  | 'PENDIENTE' 
  | 'CORRECTO' 
  | 'CORREGIDO' 
  | 'REVISAR' 
  | 'FALTANTE_EDUGE' 
  | 'BAJA' 
  | 'ELIMINADO';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  passwordChangedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Edificio {
  id: number;
  cui: string;
  calle: string;
  numeroPuerta: string;
  orientacion?: string | null;
  codigoPostal?: number | null;
  localidad: string;
  latitud?: number | null;
  longitud?: number | null;
  letraZona?: string | null;
  zonaDepartamento: string;
  teVoip?: string | null;
  establecimientos?: Establecimiento[];
}

export interface Establecimiento {
  id: number;
  edificioId: number;
  cue: string;
  cueEdificioPrincipal: string;
  nombre: string;
  establecimientoCabecera: string;
  deletedAt?: Date | null;
  edificio?: Edificio;
  modalidades?: Modalidad[];
}

export interface Modalidad {
  id: number;
  establecimientoId: number;
  direccionArea: string;
  nivelEducativo: string;
  sector: number; // 1 = Estatal, 2 = Privado
  zona?: string | null;
  observaciones?: string | null;
  categoria?: string | null;
  instLegalCategoria?: string | null;
  radio?: string | null;
  instLegalRadio?: string | null;
  instLegalCategoriaBis?: string | null;
  instLegalCreacion?: string | null;
  ambito: string;
  validado: boolean;
  estadoValidacion: ValidationState;
  validadoPorUserId?: number | null;
  validadoEn?: Date | null;
  deletedAt?: Date | null;
  establecimiento?: Establecimiento;
  usuarioValidacion?: User | null;
}

export interface HistorialEstadoModalidad {
  id: number;
  modalidadId: number;
  userId: number;
  estadoAnterior: string;
  estadoNuevo: string;
  observaciones?: string | null;
  createdAt: Date;
  modalidad?: Modalidad;
  user?: User;
}

export interface ActivityLog {
  id: number;
  userId?: number | null;
  action: string;
  modelType: string;
  modelId: number;
  description?: string | null;
  changes?: any | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  user?: User | null;
}

// Authentication Interfaces
export interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}

// Dashboard statistics
export interface DashboardStats {
  stats: {
    totalEstablecimientos: number;
    totalModalidades: number;
    totalEdificios: number;
  };
  modalidades: {
    labels: string[];
    values: number[];
  };
  categorias: {
    labels: string[];
    values: number[];
  };
  zonas: {
    labels: string[];
    values: number[];
  };
  radios: {
    labels: string[];
    values: number[];
  };
  ambito: {
    labels: string[];
    values: number[];
  };
}
