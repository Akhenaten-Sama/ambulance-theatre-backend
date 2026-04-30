import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index, JoinColumn } from 'typeorm';
import { Hospital } from '../hospital/hospital.entity';
import { TheatreType, TheatreStatus, SterilityClass, MedicalSpecialty } from '../common/enums';
import { Equipment, MaintenanceSchedule } from '../common/types';

@Entity('theatres')
@Index(['hospital_id'])
@Index(['status'])
export class Theatre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Basic Info
  @Column({ type: 'uuid' })
  hospital_id: string;

  @ManyToOne(() => Hospital, (hospital) => hospital.theatres, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hospital_id' })
  hospital: Hospital;

  @Column()
  name: string; // e.g., "OT-1", "Theatre A"

  @Column({ nullable: true })
  floor: string;

  @Column({ nullable: true })
  room_number: string;

  // Type & Capabilities
  @Column({ type: 'enum', enum: TheatreType, default: TheatreType.GENERAL })
  type: TheatreType;

  @Column('enum', { enum: MedicalSpecialty, array: true, default: '{}' })
  specialties: MedicalSpecialty[];

  @Column() // Keep for backward compatibility
  specialty: string;

  // Equipment
  @Column('jsonb', { default: '[]' })
  equipment: Equipment[];

  @Column({ default: false })
  has_robotic_surgery: boolean;

  @Column({ default: false })
  has_imaging: boolean;

  @Column({ default: false })
  has_hybrid_capabilities: boolean;

  // Capacity
  @Column({ type: 'int', default: 10 })
  max_team_size: number;

  @Column({ type: 'enum', enum: SterilityClass, default: SterilityClass.CLASS_B })
  sterility_class: SterilityClass;

  // Availability
  @Column({ type: 'enum', enum: TheatreStatus, default: TheatreStatus.AVAILABLE })
  @Index()
  status: TheatreStatus;

  @Column({ default: true })
  available: boolean;

  @Column('timestamp', { nullable: true })
  available_from: Date;

  @Column('timestamp', { nullable: true })
  available_to: Date;

  // Current Operation
  @Column({ type: 'uuid', nullable: true })
  current_surgery_id: string;

  @Column({ type: 'uuid', nullable: true })
  current_surgeon_id: string;

  @Column({ type: 'timestamp', nullable: true })
  estimated_completion: Date;

  // Scheduling - will be handled by TheatreBooking entity
  // bookings: TheatreBooking[];

  @Column('jsonb', { default: '[]' })
  maintenance_schedule: MaintenanceSchedule[];

  // Metrics
  @Column('float', { default: 0 })
  utilization_rate: number; // Percentage

  @Column('float', { default: 45 })
  average_turnover_time: number; // minutes

  @Column({ type: 'int', default: 0 })
  total_surgeries: number;

  // Audit
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
