import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { StorageLocation } from './storage-location.entity';
import { Order } from '../../orders/entities/order.entity';
import { MasterCatalogItem } from '../../catalogs/entities/master-catalog-item.entity';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sku: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @ManyToOne(() => MasterCatalogItem)
  @JoinColumn({ name: 'unit_id' })
  unit: MasterCatalogItem;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => StorageLocation, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location: StorageLocation;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
