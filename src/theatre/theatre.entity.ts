import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Hospital } from '../hospital/hospital.entity';

@Entity()
export class Theatre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Hospital, (hospital) => hospital.theatres, { eager: true })
  hospital: Hospital;

  @Column()
  specialty: string;

  @Column('timestamp')
  available_from: Date;

  @Column('timestamp')
  available_to: Date;

  @Column({ default: true })
  available: boolean;
}
