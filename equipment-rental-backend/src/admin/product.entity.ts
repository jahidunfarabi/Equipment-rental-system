import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AdminEntity } from './admin.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number; // Auto-incrementing ID

  @Column()
  name!: string;

  @Column('decimal')
  price!: number;

  // Relationship: Many products belong to one Admin
  @ManyToOne(() => AdminEntity, (admin) => admin.products, {
    onDelete: 'CASCADE', // Delete products if Admin is removed
  })
  admin!: AdminEntity;
}
