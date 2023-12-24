import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart as CartRepo } from '../../database/entities/cart.entity';

import { v4 } from 'uuid';

import { Cart } from '../models';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartRepo) private readonly cartRepository: Repository<Cart>,
  ) {}
  // private userCarts: Record<string, Cart> = {};

  findByUserId(user_id: string) {
      return this.cartRepository.findOneBy({ user_id });
  }

  createByUserId(userId: string) {
    // const id = v4();
    const userCart = {
      user_id: userId,
    } as unknown as Cart;

    this.cartRepository.save(userCart)

    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  // updateByUserId(userId: string, { items }): Cart {
  //   const { id, ...rest } = this.findOrCreateByUserId(userId);

  //   const updatedCart = {
  //     id,
  //     ...rest,
  //     items: [...items],
  //   };

  //   this.userCarts[userId] = { ...updatedCart };

  //   return { ...updatedCart };
  // }

  removeByUserId(userId): void {
    this.cartRepository.delete(userId);
  }
}
