import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  driverCode: string;

  @ManyToOne(() => Store)
  store: Store;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ type: 'date', nullable: true })
  licenseExpiration: Date;

  @Column({ default: 'ACTIVE' })
  status: string; // ACTIVE, ON_TRIP, INACTIVE

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
