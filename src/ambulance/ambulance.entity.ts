import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Hospital } from '../hospital/hospital.entity';
import { AmbulanceStatus, AmbulanceType } from '../common/enums';
import { Equipment, Supply, LocationHistory } from '../common/types';

@Entity('ambulances')
@Index(['hospital_id'])
export class Ambulance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Basic Info
  @Column({ unique: true })
  vehicle_number: string; // License plate

  @Column()
  vehicle_make: string; // e.g., Mercedes, Ford

  @Column()
  vehicle_model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ nullable: true })
  vin: string; // Vehicle Identification Number

  // Assignment
  @Column({ type: 'uuid', nullable: true })
  hospital_id: string;

  @ManyToOne(() => Hospital, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'hospital_id' })
  hospital: Hospital;

  @Column({ type: 'uuid', nullable: true })
  current_driver_id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'current_driver_id' })
  driver: User;

  @Column('uuid', { array: true, default: '{}' })
  paramedics: string[]; // Array of paramedic user IDs

  // Location & Tracking
  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })
  @Index({ spatial: true })
  current_location: { type: 'Point'; coordinates: [number, number] }; // GeoJSON Point

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column('float', { nullable: true })
  heading: number; // Direction in degrees (0-360)

  @Column('float', { nullable: true, default: 0 })
  speed: number; // km/h

  @Column('jsonb', { nullable: true })
  location_history: LocationHistory[]; // Last 100 locations

  // Status
  @Column({ type: 'enum', enum: AmbulanceStatus, default: AmbulanceStatus.AVAILABLE })
  @Index()
  status: AmbulanceStatus;

  @Column({ default: true })
  available: boolean; // Quick availability flag

  @Column({ type: 'date', nullable: true })
  last_maintenance_date: Date;

  @Column({ type: 'date', nullable: true })
  next_maintenance_due: Date;

  @Column('float', { default: 0 })
  mileage: number; // Total kilometers

  // Equipment
  @Column('jsonb', { default: '[]' })
  equipment: Equipment[];

  @Column('jsonb', { default: '[]' })
  medical_supplies: Supply[];

  // Capabilities
  @Column({ type: 'enum', enum: AmbulanceType, default: AmbulanceType.BASIC })
  type: AmbulanceType;

  @Column({ type: 'int', default: 1 })
  capacity: number; // Number of patients

  @Column({ default: false })
  has_life_support: boolean;

  @Column({ default: false })
  has_ventilator: boolean;

  @Column({ default: true })
  has_defibrillator: boolean;

  @Column({ default: false })
  has_incubator: boolean;

  // Performance Metrics
  @Column({ type: 'int', default: 0 })
  total_trips: number;

  @Column('float', { default: 0 })
  average_response_time: number; // minutes

  @Column('float', { default: 5, nullable: true })
  rating: number; // 0-5

  // Audit
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
