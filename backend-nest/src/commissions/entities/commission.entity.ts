import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Store } from '../../stores/entities/store.entity';
import { CommissionRule } from '../../commission_rules/entities/commission_rule.entity';

@Entity('commissions')
export class Commission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  commissionCode: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => CommissionRule, { nullable: true })
  @JoinColumn({ name: 'rule_id' })
  rule: CommissionRule;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  baseAmount: number;

  @Column()
  commissionType: string; // PERCENTAGE, FIXED_AMOUNT

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rate: number; // Percentage or fixed amount value

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // Calculated result

  @Column({ default: 'CALCULATED' })
  status: string; // CALCULATED, PENDING, CONFIRMED, CANCELLED

  @Column({ type: 'datetime', nullable: true })
  confirmedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
