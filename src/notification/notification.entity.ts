import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { NotificationType, NotificationChannel, NotificationPriority } from '../common/enums';

@Entity('notifications')
@Index(['user_id'])
@Index(['created_at'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Recipient
  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Content
  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column('jsonb', { nullable: true })
  data: Record<string, any>; // Additional metadata

  // Delivery
  @Column('enum', { enum: NotificationChannel, array: true, default: '{in_app}' })
  channels: NotificationChannel[];

  @Column({ type: 'enum', enum: NotificationPriority, default: NotificationPriority.MEDIUM })
  priority: NotificationPriority;

  // Status
  @Column({ default: false })
  @Index()
  is_read: boolean;

  @Column({ type: 'timestamp', nullable: true })
  read_at: Date;

  @Column({ default: false })
  is_delivered: boolean;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at: Date;

  // Action
  @Column({ nullable: true })
  action_url: string;

  @Column({ nullable: true })
  action_type: string;

  // Expiry
  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  // Audit
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
