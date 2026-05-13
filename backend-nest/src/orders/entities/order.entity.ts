import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { Service } from '../../services/entities/service.entity';
import { Quotation } from '../../quotations/entities/quotation.entity';
import { MasterCatalogItem } from '../../catalogs/entities/master-catalog-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  orderCode: string; // ORD-YYYY-NNNN

  @OneToOne(() => Quotation)
  @JoinColumn({ name: 'quotation_id' })
  quotation: Quotation;

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
  subtotalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  commissionAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  providerNetAmount: number;

  @ManyToOne(() => MasterCatalogItem)
  @JoinColumn({ name: 'currency_code_id' })
  currency: MasterCatalogItem;

  @Column({
    type: 'varchar',
    default: 'CREATED',
  })
  operationalStatus: string; // CREATED, IN_PROCESS, PENDING_DOCUMENTS, PENDING_PAYMENT, EXECUTING, ON_HOLD, CLOSED, CANCELLED

  @Column({
    type: 'varchar',
    default: 'UNPAID',
  })
  financialStatus: string; // UNPAID, PENDING, SUBMITTED, CONFIRMED, REJECTED, PARTIAL, REFUNDED

  @Column({
    type: 'varchar',
    default: 'PENDING',
  })
  documentStatus: string; // PENDING, PARTIAL, IN_REVIEW, VALIDATED, REJECTED, EXPIRED

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
