import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Warehouse } from './warehouse.entity';

@Entity('storage_locations')
export class StorageLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column()
  aisle: string;

  @Column()
  shelf: string;

  @Column()
  level: string;

  @Column({ default: 'empty' })
  status: string; // empty, partial, full
}
