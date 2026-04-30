export enum EmergencyType {
  CARDIAC_ARREST = 'cardiac_arrest',
  RESPIRATORY_DISTRESS = 'respiratory_distress',
  TRAUMA = 'trauma',
  STROKE = 'stroke',
  ACCIDENT = 'accident',
  BURN = 'burn',
  POISONING = 'poisoning',
  MATERNITY = 'maternity',
  PSYCHIATRIC = 'psychiatric',
  ALLERGIC_REACTION = 'allergic_reaction',
  SEIZURE = 'seizure',
  UNCONSCIOUS = 'unconscious',
  BLEEDING = 'bleeding',
  FRACTURE = 'fracture',
  OTHER = 'other',
}

export enum EmergencySeverity {
  CRITICAL = 'critical', // Life-threatening
  URGENT = 'urgent', // Serious but stable
  NON_URGENT = 'non_urgent', // Minor emergency
  ROUTINE = 'routine', // Scheduled transport
}

export enum RequestStatus {
  PENDING = 'pending',
  DISPATCHED = 'dispatched',
  ACCEPTED = 'accepted',
  EN_ROUTE = 'en_route',
  AT_SCENE = 'at_scene',
  TRANSPORTING = 'transporting',
  ARRIVED = 'arrived',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}
