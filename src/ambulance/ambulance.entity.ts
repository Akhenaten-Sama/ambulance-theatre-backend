import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Ambulance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  driver: User;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column({ default: true })
  available: boolean;
}
