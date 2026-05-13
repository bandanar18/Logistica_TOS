import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  warehouseCode: string;

  @Column()
  warehouseName: string;

  @ManyToOne(() => Store)
  store: Store;

  @Column()
  warehouseType: string; // BONDED, GENERAL, REEFER

  @Column()
  address: string;

  @Column({ nullable: true })
  capacityUnits: number;

  @Column({ default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
