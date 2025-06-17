import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Theatre } from '../theatre/theatre.entity';

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @OneToMany(() => Theatre, (theatre) => theatre.hospital)
  theatres: Theatre[];
}
