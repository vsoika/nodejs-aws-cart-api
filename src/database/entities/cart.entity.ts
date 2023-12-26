import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CartItem } from './cart_items.entity';

@Entity({ name: 'cart', schema: 'public' })
export class Cart {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'enum', enum: ['OPEN', 'ORDERED'] })
  status: string;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
    eager: true, 
  })
  items?: CartItem[];
}
