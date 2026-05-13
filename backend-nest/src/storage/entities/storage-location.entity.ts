import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Warehouse } from './warehouse.entity';

@Entity('storage_locations')
export class StorageLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  locationCode: string;

  @ManyToOne(() => Warehouse)
  warehouse: Warehouse;

  @Column({ nullable: true })
  zone: string;

  @Column({ nullable: true })
  aisle: string;

  @Column({ nullable: true })
  rack: string;

  @Column({ nullable: true })
  position: string;

  @Column({ default: 'EMPTY' })
  status: string; // EMPTY, OCCUPIED, RESERVED

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
