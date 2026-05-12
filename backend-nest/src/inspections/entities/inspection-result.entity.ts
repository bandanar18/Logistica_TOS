import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Inspection } from './inspection.entity';

@Entity('inspection_results')
export class InspectionResult {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Inspection)
  @JoinColumn({ name: 'inspection_id' })
  inspection: Inspection;

  @Column({ type: 'text' })
  findings: string;

  @Column()
  verdict: string; // approved, rejected, with_observations

  @Column({ type: 'json', nullable: true })
  checklist: any;

  @CreateDateColumn()
  createdAt: Date;
}
