import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index, JoinColumn } from 'typeorm';
import { Theatre } from '../theatre/theatre.entity';
import { Hospital } from '../hospital/hospital.entity';
import { User } from '../user/user.entity';
import { BookingStatus, BookingPriority, SurgeryType, AnesthesiaType, SurgeryOutcome, PaymentStatus } from '../common/enums';
import { Equipment, Supply } from '../common/types';

@Entity('theatre_bookings')
@Index(['theatre_id'])
@Index(['patient_id'])
export class TheatreBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // References
  @Column({ type: 'uuid' })
  theatre_id: string;

  @ManyToOne(() => Theatre, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'theatre_id' })
  theatre: Theatre;

  @Column({ type: 'uuid' })
  hospital_id: string;

  @ManyToOne(() => Hospital, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hospital_id' })
  hospital: Hospital;

  @Column({ type: 'uuid' })
  patient_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  // Surgery Details
  @Column({ type: 'enum', enum: SurgeryType })
  surgery_type: SurgeryType;

  @Column()
  procedure_name: string;

  @Column({ nullable: true })
  procedure_code: string; // ICD-10 or CPT code

  @Column()
  specialty: string;

  // Medical Team
  @Column({ type: 'uuid' })
  lead_surgeon_id: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'lead_surgeon_id' })
  lead_surgeon: User;

  @Column('uuid', { array: true, default: '{}' })
  assistant_surgeons: string[];

  @Column({ type: 'uuid', nullable: true })
  anesthesiologist_id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'anesthesiologist_id' })
  anesthesiologist: User;

  @Column('uuid', { array: true, default: '{}' })
  nurses: string[];

  // Scheduling
  @Column({ type: 'timestamp' })
  @Index()
  scheduled_start: Date;

  @Column({ type: 'timestamp' })
  scheduled_end: Date;

  @Column({ type: 'timestamp', nullable: true })
  actual_start: Date;

  @Column({ type: 'timestamp', nullable: true })
  actual_end: Date;

  @Column({ type: 'int' })
  estimated_duration: number; // minutes

  @Column({ type: 'int', nullable: true })
  actual_duration: number;

  // Status
  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.REQUESTED })
  @Index()
  status: BookingStatus;

  @Column({ type: 'enum', enum: BookingPriority, default: BookingPriority.SCHEDULED })
  priority: BookingPriority;

  // Pre-op
  @Column({ default: false })
  pre_op_assessment_completed: boolean;

  @Column({ type: 'enum', enum: AnesthesiaType, nullable: true })
  anesthesia_type: AnesthesiaType;

  @Column('text', { array: true, default: '{}' })
  special_requirements: string[];

  // Equipment & Supplies
  @Column('jsonb', { default: '[]' })
  required_equipment: Equipment[];

  @Column('jsonb', { default: '[]' })
  required_supplies: Supply[];

  // Cost & Billing
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  estimated_cost: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  actual_cost: number;

  @Column({ nullable: true })
  insurance_approval: string;

  @Column({ type: 'enum', enum: PaymentStatus, nullable: true })
  payment_status: PaymentStatus;

  // Notes
  @Column('text', { nullable: true })
  surgeon_notes: string;

  @Column('text', { nullable: true })
  anesthesia_notes: string;

  @Column('text', { nullable: true })
  nursing_notes: string;

  @Column('text', { nullable: true })
  complications: string;

  // Outcomes
  @Column({ type: 'enum', enum: SurgeryOutcome, nullable: true })
  outcome: SurgeryOutcome;

  @Column({ default: false })
  follow_up_required: boolean;

  // Cancellation
  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date;

  @Column('text', { nullable: true })
  cancellation_reason: string;

  // Audit
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'uuid' })
  created_by: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;
}
