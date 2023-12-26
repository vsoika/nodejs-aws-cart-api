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

  createByUserId(userId: string) {
    const id = v4();
    const userCart = {
      id,
      user_id: userId,
      items: [],
    };

    console.log('userCart', userCart);

    this.cartRepository.save(userCart);

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
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    };

    const updatedCartEntity = await this.cartRepository.preload(updatedCart);

    await this.cartRepository.save(updatedCartEntity);

    this.userCarts[userId] = { ...updatedCart };

    return { ...updatedCart };
  }

  removeByUserId(userId): void {
    console.log('userId', userId);

    this.cartRepository.delete({ user_id: userId });
  }
}
