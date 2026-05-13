import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MasterCatalog } from './master-catalog.entity';

@Entity('master_catalog_items')
export class MasterCatalogItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string; // e.g., 'ADUANA', 'TRANSPORTE'

  @Column()
  name: string; // e.g., 'Aduana', 'Transporte Terrestre'

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ nullable: true })
  orderIndex: number;

  @ManyToOne(() => MasterCatalogItem, { nullable: true })
  @JoinColumn({ name: 'parent_item_id' })
  parentItem: MasterCatalogItem;

  @ManyToOne(() => MasterCatalog, catalog => catalog.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'catalog_id' })
  catalog: MasterCatalog;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
