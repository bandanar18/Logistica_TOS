import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('inspections')
export class Inspection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  inspectionType: string; // Documental, Physical, Container

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'inspector_id' })
  inspector: User;

  @Column({ default: 'scheduled' })
  status: string; // scheduled, in_progress, completed, cancelled

  @Column({ type: 'datetime', nullable: true })
  scheduledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
