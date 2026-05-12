import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Container } from './container.entity';
import { Yard } from './yard.entity';

@Entity('tos_moves')
export class Move {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Container)
  @JoinColumn({ name: 'container_id' })
  container: Container;

  @ManyToOne(() => Yard)
  @JoinColumn({ name: 'from_yard_id' })
  fromYard: Yard;

  @ManyToOne(() => Yard)
  @JoinColumn({ name: 'to_yard_id' })
  toYard: Yard;

  @Column({ nullable: true })
  fromLocation: string;

  @Column({ nullable: true })
  toLocation: string;

  @Column()
  moveType: string; // internal, gate-in, gate-out

  @CreateDateColumn()
  executedAt: Date;
}
