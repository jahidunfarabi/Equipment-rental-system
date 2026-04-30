import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { ProductEntity } from './product.entity';

@Entity('admins')
export class AdminEntity {
  @PrimaryColumn()
  id!: string; // Primary Key (ADM-XXXXX)

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  gender!: string;

  @Column({ type: 'bigint' })
  phone!: number;

  @Column({ default: 'admin' })
  role!: string;

  // --- Relationships ---

  @OneToOne(() => ProfileEntity, (profile) => profile.admin, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  profile!: ProfileEntity; // Linked profile

  @OneToMany(() => ProductEntity, (product) => product.admin, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  products!: ProductEntity[]; // List of products

  // --- Hooks ---

  @BeforeInsert()
  generateId(): void {
    // Generate random ID for new admin
    this.id = `ADM-${Math.floor(10000 + Math.random() * 90000)}`;
  }
}
