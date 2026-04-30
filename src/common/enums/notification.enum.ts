export enum NotificationType {
  EMERGENCY_REQUEST = 'emergency_request',
  AMBULANCE_DISPATCHED = 'ambulance_dispatched',
  AMBULANCE_ARRIVED = 'ambulance_arrived',
  AMBULANCE_EN_ROUTE = 'ambulance_en_route',
  THEATRE_AVAILABLE = 'theatre_available',
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_REMINDER = 'booking_reminder',
  BOOKING_CANCELLED = 'booking_cancelled',
  STATUS_UPDATE = 'status_update',
  SYSTEM_ALERT = 'system_alert',
  PAYMENT_RECEIVED = 'payment_received',
  MESSAGE = 'message',
}

export enum NotificationChannel {
  PUSH = 'push',
  SMS = 'sms',
  EMAIL = 'email',
  IN_APP = 'in_app',
  VOICE = 'voice',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}
