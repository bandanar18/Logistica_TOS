import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  paymentCode: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column()
  paymentMethod: string; // BANK_TRANSFER, CASH, etc.

  @Column({ nullable: true })
  paymentReference: string;

  @Column({ nullable: true })
  receiptUrl: string;

  @Column({ default: 'CREATED' })
  status: string; // CREATED, SUBMITTED, IN_REVIEW, CONFIRMED, REJECTED

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
