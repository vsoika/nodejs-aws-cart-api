import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../../database/entities/cart.entity';

import { v4 } from 'uuid';

// import { Cart } from '../models';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
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
      status: "OPEN",
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

  async updateByUserId(userId: string, { items }): Promise<Cart> {
    const { id, items: cartItems, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [...items, ...cartItems],
    };

    const updatedCartEntity = await this.cartRepository.preload(updatedCart);

    await this.cartRepository.save(updatedCartEntity);

    this.userCarts[userId] = { ...updatedCart };

    return { ...updatedCart };
  }

  async removeByUserId(userId): Promise<void> {

    await this.cartRepository.delete({user_id: userId});
  }
}
