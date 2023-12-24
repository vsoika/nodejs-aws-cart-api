import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('cart_item')
export class CartItem {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryColumn({ type: 'uuid' })
  cart_id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @Column({ type: 'int' })
  count: number;
}
