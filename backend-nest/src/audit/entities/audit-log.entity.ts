import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  auditCode: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  userProfile: string;

  @Column()
  module: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  entityType: string;

  @Column({ nullable: true })
  entityId: string;

  @Column({ nullable: true })
  entityCode: string;

  @Column({ type: 'json', nullable: true })
  oldValues: any;

  @Column({ type: 'json', nullable: true })
  newValues: any;

  @Column({ nullable: true })
  changeReason: string;

  @Column({ nullable: true })
  severity: string; // LOW, MEDIUM, HIGH, CRITICAL

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  requestId: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;
}
