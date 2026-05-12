import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  legalName: string;

  @Column()
  taxId: string; // RIF

  @Column({ nullable: true })
  basePort: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  brandColor: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ default: 'pending' })
  status: string; // pending, approved, rejected, suspended

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
