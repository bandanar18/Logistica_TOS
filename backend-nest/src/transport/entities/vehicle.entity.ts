import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  vehicleCode: string;

  @ManyToOne(() => Store)
  store: Store;

  @Column()
  vehicleType: string; // e.g., TRUCK, VAN, MOTORCYCLE

  @Column()
  plateNumber: string;

  @Column({ nullable: true })
  capacityWeight: number;

  @Column({ nullable: true })
  capacityVolume: number;

  @Column({ default: 'ACTIVE' })
  status: string; // ACTIVE, MAINTENANCE, INACTIVE

  @Column({ type: 'date', nullable: true })
  insuranceExpiration: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
