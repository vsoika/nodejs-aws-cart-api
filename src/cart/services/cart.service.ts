import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../../database/entities/cart.entity';

import { v4 } from 'uuid';
import { CartItem } from 'src/database/entities/cart_items.entity';

// import { Cart } from '../models';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}
  private userCarts: Record<string, Cart> = {};

  findByUserId(id: string) {
    return this.cartRepository.find({
      where: { user_id: id },
      relations: ['items'],
      // loadRelationIds: true,
    });
  }

  async createByUserId(userId: string) {
    const id = v4();
    const userCart = {
      id,
      user_id: userId,
      status: 'OPEN',
      items: [],
    };

    await this.cartRepository.insert(userCart);

    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);
    console.log(userCart);

    if (userCart[0]) {
      return userCart[0];
    }

    const newUser = (await this.createByUserId(userId)) as unknown as Cart;
    return newUser;
  }

  async updateByUserId(userId: string, { product, count }): Promise<Cart> {
    const {
      id,
      items: cartItems,
      ...rest
    } = await this.findOrCreateByUserId(userId);

    const existingProductItem = cartItems.find(
      (item) => item?.product === product.id,
    );

    const item_id = v4();
    const newProductItem = {
      id: item_id,
      cart_id: id,
      product_id: product.id,
      product,
      count,
    } as unknown as CartItem;

    const item: CartItem = existingProductItem
      ? {
          count,
          ...existingProductItem,
        }
      : { ...newProductItem };

    if (!existingProductItem) {
      await this.cartItemRepository.insert(newProductItem);
    }

    const updatedCart = {
      id,
      ...rest,
      items: [
        ...[item],
        ...cartItems.filter((item) => item?.product_id !== product.id),
      ],
    };

    const updatedCartEntity = await this.cartRepository.preload(updatedCart);

    await this.cartRepository.save(updatedCartEntity);

    this.userCarts[userId] = { ...updatedCart };

    return { ...updatedCart };
  }

  async removeByUserId(userId): Promise<void> {
    await this.cartRepository.delete({ user_id: userId });
  }
}
