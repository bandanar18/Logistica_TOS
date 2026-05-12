import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { Service } from '../../services/entities/service.entity';

@Entity('quotations')
export class Quotation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  client: User;

  @ManyToOne(() => Store)
  store: Store;

  @ManyToOne(() => Service)
  service: Service;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  responseNotes: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'responded', 'approved', 'rejected', 'order_created'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
