import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity('profiles')
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  address!: string;

  @Column({ nullable: true })
  bio!: string;

  // onDelete: 'CASCADE' যুক্ত করা হয়েছে
  @OneToOne(() => AdminEntity, (admin) => admin.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn() // One-to-One relationship with AdminEntity
  admin!: AdminEntity;
}
