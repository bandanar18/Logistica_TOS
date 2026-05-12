import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Yard } from './yard.entity';

@Entity('tos_containers')
export class Container {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  containerNumber: string;

  @Column()
  type: string; // 20DC, 40HC, etc.

  @Column({ default: 'empty' })
  loadStatus: string; // empty, full

  @ManyToOne(() => Yard, { nullable: true })
  @JoinColumn({ name: 'yard_id' })
  yard: Yard;

  @Column({ nullable: true })
  locationInYard: string; // Slot coordinate

  @Column({ default: 'available' })
  status: string; // available, blocked, departed

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
