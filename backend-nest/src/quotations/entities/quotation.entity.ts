import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { Service } from '../../services/entities/service.entity';
import { MasterCatalogItem } from '../../catalogs/entities/master-catalog-item.entity';

@Entity('quotations')
export class Quotation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  quotationCode: string; // COT-YYYY-NNNN

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => Service)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quantity: number;

  @ManyToOne(() => MasterCatalogItem)
  @JoinColumn({ name: 'unit_measure_id' })
  unitMeasure: MasterCatalogItem;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  subtotalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  commissionAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalAmount: number;

  @ManyToOne(() => MasterCatalogItem)
  @JoinColumn({ name: 'currency_code_id' })
  currency: MasterCatalogItem;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  responseNotes: string;

  @Column({
    type: 'varchar',
    default: 'REQUESTED',
  })
  status: string; // REQUESTED, IN_REVIEW, RESPONDED, APPROVED, REJECTED, EXPIRED, CONVERTED, CANCELLED

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
