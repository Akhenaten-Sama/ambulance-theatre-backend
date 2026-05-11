import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index } from 'typeorm';
import { Theatre } from '../theatre/theatre.entity';
import { HospitalType, TraumaCenterLevel, MedicalSpecialty } from '../common/enums';
import { Address, PhoneNumber, Department, Accreditation, OperatingHours } from '../common/types';

@Entity('hospitals')
export class Hospital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Basic Info
  @Column()
  name: string;

  @Column({ nullable: true })
  short_name: string;

  @Column({ unique: true })
  registration_number: string; // Unique government ID

  @Column({ type: 'enum', enum: HospitalType, default: HospitalType.PUBLIC })
  @Index()
  type: HospitalType;

  // Contact
  @Column('jsonb', { default: '[]' })
  phone_numbers: PhoneNumber[];

  @Column()
  email: string;

  @Column({ nullable: true })
  website: string;

  // Location
  @Column('jsonb')
  address: Address;

  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })
  @Index({ spatial: true })
  location: { type: 'Point'; coordinates: [number, number] }; // GeoJSON Point

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column('float', { nullable: true, default: 10 })
  service_area_radius: number; // Coverage area in km

  // Facilities
  @Column({ type: 'int', default: 0 })
  total_beds: number;

  @Column({ type: 'int', default: 0 })
  available_beds: number;

  @Column({ type: 'int', default: 0 })
  icu_beds: number;

  @Column({ type: 'int', default: 0 })
  available_icu_beds: number;

  @Column({ type: 'int', default: 0 })
  emergency_beds: number;

  @Column({ type: 'int', default: 0 })
  available_emergency_beds: number;

  // Departments
  @Column('jsonb', { default: '[]' })
  departments: Department[];

  @Column('enum', { enum: MedicalSpecialty, array: true, default: '{}' })
  specialties: MedicalSpecialty[];

  // Theatres
  @OneToMany(() => Theatre, (theatre) => theatre.hospital)
  theatres: Theatre[];

  @Column({ type: 'int', default: 0 })
  total_theatres: number;

  @Column({ type: 'int', default: 0 })
  available_theatres: number;

  // Staff
  @Column('uuid', { array: true, default: '{}' })
  doctors: string[];

  @Column('uuid', { array: true, default: '{}' })
  nurses: string[];

  @Column('uuid', { array: true, default: '{}' })
  admin_staff: string[];

  // Services
  @Column('text', { array: true, default: '{}' })
  services: string[]; // e.g., ['Emergency', 'Radiology', 'Laboratory']

  @Column({ default: true })
  emergency_services: boolean;

  @Column({ type: 'enum', enum: TraumaCenterLevel, nullable: true })
  trauma_center_level: TraumaCenterLevel;

  // Certifications & Ratings
  @Column('jsonb', { default: '[]' })
  accreditations: Accreditation[];

  @Column('float', { default: 0, nullable: true })
  rating: number; // 0-5

  @Column({ type: 'int', default: 0 })
  total_reviews: number;

  // Availability
  @Column({ default: true })
  is_operational: boolean;

  @Column('jsonb', { nullable: true })
  operating_hours: OperatingHours;

  @Column({ default: true })
  emergency_24x7: boolean;

  // Metrics
  @Column('float', { default: 30 })
  average_wait_time: number; // minutes

  @Column('float', { default: 0 })
  patient_satisfaction_score: number; // 0-100

  // Availability (from original)
  @Column({ default: true })
  available: boolean;

  // Audit
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
