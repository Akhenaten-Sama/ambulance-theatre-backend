export * from './user.enum';
export * from './ambulance.enum';
export * from './hospital.enum';
export * from './theatre.enum';
export * from './emergency.enum';
export * from './booking.enum';
export * from './notification.enum';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}
