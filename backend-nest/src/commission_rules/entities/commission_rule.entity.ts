import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';

@Entity('commission_rules')
export class CommissionRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  ruleCode: string;

  @Column()
  ruleName: string;

  @Column()
  commissionType: string; // PERCENTAGE, FIXED_AMOUNT

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  percentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fixedAmount: number;

  @Column({ nullable: true })
  serviceCategory: string; // e.g., TRANSPORT, STORAGE, CUSTOMS

  @ManyToOne(() => Store, { nullable: true })
  store: Store; // Null means global rule

  @Column({ default: 0 })
  priority: number; // Higher number = higher priority

  @Column({ default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
