import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Yard } from './yard.entity';
import { MasterCatalogItem } from '../../catalogs/entities/master-catalog-item.entity';

@Entity('tos_containers')
export class Container {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  containerNumber: string;

  @ManyToOne(() => MasterCatalogItem)
  @JoinColumn({ name: 'type_id' })
  type: MasterCatalogItem; // 20GP, 40HC, etc.

  @ManyToOne(() => MasterCatalogItem)
  @JoinColumn({ name: 'load_status_id' })
  loadStatus: MasterCatalogItem; // empty, full

  @ManyToOne(() => Yard, { nullable: true })
  @JoinColumn({ name: 'yard_id' })
  yard: Yard;

  @Column({ nullable: true })
  locationInYard: string; // Slot coordinate

  @ManyToOne(() => MasterCatalogItem)
  @JoinColumn({ name: 'status_id' })
  status: MasterCatalogItem; // available, blocked, departed

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
