import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { MasterCatalogItem } from './master-catalog-item.entity';

@Entity('master_catalogs')
export class MasterCatalog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // e.g., 'SERVICE_CATEGORIES', 'PORTS', 'STORE_TYPES'

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'active' })
  status: string;

  @OneToMany(() => MasterCatalogItem, item => item.catalog)
  items: MasterCatalogItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
