import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { MasterCatalogItem } from '../../catalogs/entities/master-catalog-item.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column()
  billingUnit: string; // e.g., 'Contenedor', 'Viaje', 'Hora'

  @Column({ default: 'draft' })
  status: string; // draft, published, paused

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => MasterCatalogItem)
  @JoinColumn({ name: 'category_id' })
  category: MasterCatalogItem;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
