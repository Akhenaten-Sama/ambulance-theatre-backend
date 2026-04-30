export enum TheatreType {
  GENERAL = 'general',
  CARDIAC = 'cardiac',
  CARDIOTHORACIC = 'cardiothoracic',
  NEURO = 'neuro',
  NEUROSURGERY = 'neurosurgery',
  ORTHOPEDIC = 'orthopedic',
  PEDIATRIC = 'pediatric',
  EMERGENCY = 'emergency',
  HYBRID = 'hybrid',
  DAY_SURGERY = 'day_surgery',
}

export enum TheatreStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  CLEANING = 'cleaning',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved',
  EMERGENCY_HOLD = 'emergency_hold',
  OUT_OF_SERVICE = 'out_of_service',
}

export enum SterilityClass {
  CLASS_A = 'class_a', // Ultra-clean
  CLASS_B = 'class_b', // Standard
  CLASS_C = 'class_c', // Basic
}
