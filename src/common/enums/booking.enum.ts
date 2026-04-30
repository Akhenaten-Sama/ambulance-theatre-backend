export enum BookingStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show',
}

export enum BookingPriority {
  EMERGENCY = 'emergency', // Immediate
  URGENT = 'urgent', // Within 24 hours
  SCHEDULED = 'scheduled', // Planned
  ELECTIVE = 'elective', // Can be rescheduled
}

export enum SurgeryType {
  EMERGENCY = 'emergency',
  URGENT = 'urgent',
  ELECTIVE = 'elective',
  DAY_SURGERY = 'day_surgery',
}

export enum AnesthesiaType {
  GENERAL = 'general',
  REGIONAL = 'regional',
  LOCAL = 'local',
  SEDATION = 'sedation',
  NONE = 'none',
}

export enum SurgeryOutcome {
  SUCCESSFUL = 'successful',
  COMPLICATIONS = 'complications',
  PARTIAL_SUCCESS = 'partial_success',
  FAILED = 'failed',
  ABORTED = 'aborted',
}
