import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Vehicle } from './vehicle.entity';
import { Driver } from './driver.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tripCode: string;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => Store)
  carrier: Store;

  @ManyToOne(() => Vehicle, { nullable: true })
  vehicle: Vehicle;

  @ManyToOne(() => Driver, { nullable: true })
  driver: Driver;

  @Column()
  tripType: string; // e.g., PORT_TO_WAREHOUSE, WAREHOUSE_TO_CLIENT

  @Column()
  originName: string;

  @Column()
  originAddress: string;

  @Column()
  destinationName: string;

  @Column()
  destinationAddress: string;

  @Column({ type: 'datetime', nullable: true })
  scheduledPickupAt: Date;

  @Column({ type: 'datetime', nullable: true })
  scheduledDeliveryAt: Date;

  @Column({ type: 'datetime', nullable: true })
  actualPickupAt: Date;

  @Column({ type: 'datetime', nullable: true })
  actualDeliveryAt: Date;

  @Column({ default: 'CREATED' })
  status: string; // CREATED, ASSIGNED, IN_TRANSIT, DELIVERED, CLOSED, CANCELLED

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
