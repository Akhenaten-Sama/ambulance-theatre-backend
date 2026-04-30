import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Ambulance } from '../ambulance/ambulance.entity';
import { Hospital } from '../hospital/hospital.entity';
import { EmergencyType, EmergencySeverity, RequestStatus, PaymentStatus } from '../common/enums';
import { Address, VitalSigns, Route, StatusChange } from '../common/types';

@Entity('emergency_requests')
@Index(['patient_id'])
@Index(['status'])
@Index(['requested_at'])
@Index(['severity'])
export class EmergencyRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Patient Info
  @Column({ type: 'uuid' })
  patient_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @Column({ nullable: true })
  patient_name: string;

  @Column({ nullable: true })
  patient_phone: string;

  // Location
  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })
  @Index({ spatial: true })
  pickup_location: string; // PostGIS Point

  @Column('float')
  pickup_latitude: number;

  @Column('float')
  pickup_longitude: number;

  @Column('jsonb')
  pickup_address: Address;

  @Column({ type: 'uuid', nullable: true })
  destination_hospital_id: string;

  @ManyToOne(() => Hospital, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'destination_hospital_id' })
  destination_hospital: Hospital;

  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  destination_location: string;

  @Column('float', { nullable: true })
  destination_latitude: number;

  @Column('float', { nullable: true })
  destination_longitude: number;

  // Emergency Details
  @Column({ type: 'enum', enum: EmergencyType })
  emergency_type: EmergencyType;

  @Column({ type: 'enum', enum: EmergencySeverity })
  @Index()
  severity: EmergencySeverity;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  patient_condition: string;

  @Column('jsonb', { nullable: true })
  vital_signs: VitalSigns;

  // Assignment
  @Column({ type: 'uuid', nullable: true })
  assigned_ambulance_id: string;

  @ManyToOne(() => Ambulance, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_ambulance_id' })
  assigned_ambulance: Ambulance;

  @Column({ type: 'uuid', nullable: true })
  assigned_driver_id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_driver_id' })
  assigned_driver: User;

  @Column('uuid', { array: true, default: '{}' })
  assigned_paramedics: string[];

  // Status & Tracking
  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  @Index()
  status: RequestStatus;

  @Column('jsonb', { default: '[]' })
  status_history: StatusChange[];

  // Timing
  @CreateDateColumn()
  requested_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  dispatched_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  arrived_at_scene: Date;

  @Column({ type: 'timestamp', nullable: true })
  departed_scene: Date;

  @Column({ type: 'timestamp', nullable: true })
  arrived_at_hospital: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  // Response Metrics
  @Column('float', { nullable: true })
  response_time: number; // minutes

  @Column('float', { nullable: true })
  transport_time: number; // minutes

  @Column('float', { nullable: true })
  total_time: number; // minutes

  // Route
  @Column('jsonb', { nullable: true })
  estimated_route: Route;

  @Column('jsonb', { nullable: true })
  actual_route: Route;

  @Column('float', { nullable: true })
  distance_km: number;

  // Cost & Billing
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  estimated_cost: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  actual_cost: number;

  @Column({ type: 'enum', enum: PaymentStatus, nullable: true })
  payment_status: PaymentStatus;

  @Column({ type: 'uuid', nullable: true })
  insurance_claim_id: string;

  // Notes
  @Column('text', { nullable: true })
  dispatcher_notes: string;

  @Column('text', { nullable: true })
  driver_notes: string;

  @Column('text', { nullable: true })
  paramedic_notes: string;

  // Cancellation
  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date;

  @Column('text', { nullable: true })
  cancellation_reason: string;

  // Audit
  @UpdateDateColumn()
  updated_at: Date;
}
