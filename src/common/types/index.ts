export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Address {
  street?: string;
  city: string;
  state: string;
  country: string;
  postal_code?: string;
  full_address?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone_number: string;
  email?: string;
}

export interface InsuranceInfo {
  provider: string;
  policy_number: string;
  group_number?: string;
  expiry_date?: Date;
}

export interface Certification {
  name: string;
  issuer: string;
  number: string;
  issue_date: Date;
  expiry_date?: Date;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  in_app: boolean;
}

export interface PhoneNumber {
  number: string;
  type: 'mobile' | 'office' | 'emergency';
  is_primary: boolean;
}

export interface LocationHistory {
  timestamp: Date;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
}

export interface Equipment {
  name: string;
  quantity: number;
  status: 'available' | 'in_use' | 'maintenance';
}

export interface Supply {
  name: string;
  quantity: number;
  unit: string;
  expiry_date?: Date;
}

export interface VitalSigns {
  heart_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  respiratory_rate?: number;
  temperature?: number;
  oxygen_saturation?: number;
  glucose_level?: number;
  timestamp: Date;
}

export interface Route {
  distance_km: number;
  duration_minutes: number;
  polyline?: string; // Encoded polyline
  waypoints?: GeoPoint[];
}

export interface StatusChange {
  status: string;
  timestamp: Date;
  changed_by?: string;
  notes?: string;
}

export interface Department {
  name: string;
  head_doctor_id?: string;
  floor?: string;
  phone?: string;
}

export interface Accreditation {
  name: string;
  issuer: string;
  issue_date: Date;
  expiry_date?: Date;
}

export interface OperatingHours {
  monday?: TimeSlot;
  tuesday?: TimeSlot;
  wednesday?: TimeSlot;
  thursday?: TimeSlot;
  friday?: TimeSlot;
  saturday?: TimeSlot;
  sunday?: TimeSlot;
}

export interface TimeSlot {
  open: string; // HH:mm format
  close: string;
}

export interface MaintenanceSchedule {
  scheduled_date: Date;
  type: string;
  description?: string;
  completed: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
