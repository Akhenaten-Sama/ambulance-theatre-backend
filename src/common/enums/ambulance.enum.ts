export enum AmbulanceStatus {
  AVAILABLE = 'available',
  DISPATCHED = 'dispatched',
  EN_ROUTE = 'en_route',
  AT_SCENE = 'at_scene',
  TRANSPORTING = 'transporting',
  AT_HOSPITAL = 'at_hospital',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service',
}

export enum AmbulanceType {
  BLS = 'bls', // Basic Life Support
  BASIC = 'basic', // BLS - Basic Life Support (alias)
  ALS = 'als', // Advanced Life Support
  ADVANCED = 'advanced', // ALS - Advanced Life Support (alias)
  CRITICAL_CARE = 'critical_care', // Critical Care Transport
  AIR = 'air', // Air ambulance
  NEONATAL = 'neonatal', // Neonatal ambulance
  BARIATRIC = 'bariatric', // For obese patients
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
}
