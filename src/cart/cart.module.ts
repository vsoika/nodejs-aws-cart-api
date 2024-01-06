import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { Cart } from 'src/database/entities/cart.entity';
import { CartItem } from 'src/database/entities/cart_items.entity';

@Module({
  imports: [forwardRef(() => OrderModule), TypeOrmModule.forFeature([Cart, CartItem])],
  providers: [CartService],
  exports: [CartService],
  controllers: [CartController],
})
export class CartModule {}
