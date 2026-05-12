import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { Service } from '../../services/entities/service.entity';
import { Quotation } from '../../quotations/entities/quotation.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Quotation)
  @JoinColumn()
  quotation: Quotation;

  @ManyToOne(() => User)
  client: User;

  @ManyToOne(() => Store)
  store: Store;

  @ManyToOne(() => Service)
  service: Service;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  finalPrice: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
