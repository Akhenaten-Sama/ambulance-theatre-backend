import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index } from 'typeorm';
import { UserRole, UserStatus, BloodGroup, Gender } from '../common/enums';
import { EmergencyContact, InsuranceInfo, Certification, NotificationPreferences } from '../common/types';

@Entity('users')
@Index(['email'])
@Index(['phone_number'])
@Index(['role'])
@Index(['status'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Identity
  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ unique: true })
  @Index()
  phone_number: string;

  @Column()
  password: string;

  // Profile
  @Column()
  name: string;

  @Column({ nullable: true })
  profile_picture_url: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'enum', enum: BloodGroup, nullable: true })
  blood_group: BloodGroup;

  // Role & Permissions
  @Column({ type: 'enum', enum: UserRole, default: UserRole.PATIENT })
  @Index()
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_VERIFICATION })
  @Index()
  status: UserStatus;

  // Location
  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  current_location: string; // PostGIS Point (lon, lat)

  @Column('float', { nullable: true })
  latitude: number;

  @Column('float', { nullable: true })
  longitude: number;

  @Column({ type: 'timestamp', nullable: true })
  location_updated_at: Date;

  // Medical Profile (for patients)
  @Column('text', { array: true, default: '{}' })
  medical_conditions: string[];

  @Column('text', { array: true, default: '{}' })
  allergies: string[];

  @Column('jsonb', { nullable: true })
  emergency_contacts: EmergencyContact[];

  @Column('jsonb', { nullable: true })
  insurance_info: InsuranceInfo;

  // Driver Profile
  @Column({ nullable: true })
  driver_license_number: string;

  @Column({ type: 'date', nullable: true })
  license_expiry_date: Date;

  @Column('jsonb', { nullable: true })
  certifications: Certification[];

  // Preferences
  @Column({ default: 'en' })
  language: string;

  @Column('jsonb', { default: { email: true, sms: true, push: true, in_app: true } })
  notification_preferences: NotificationPreferences;

  // Verification
  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: false })
  is_email_verified: boolean;

  @Column({ default: false })
  is_phone_verified: boolean;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ type: 'timestamp', nullable: true })
  verification_token_expires: Date;

  // Password Reset
  @Column({ nullable: true })
  password_reset_token: string;

  @Column({ type: 'timestamp', nullable: true })
  password_reset_expires: Date;

  // Security
  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date;

  @Column({ default: 0 })
  failed_login_attempts: number;

  @Column({ type: 'timestamp', nullable: true })
  account_locked_until: Date;

  // Audit
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;
}
