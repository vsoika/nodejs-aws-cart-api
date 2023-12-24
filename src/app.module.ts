import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { Cart } from './database/entities/cart.entity';
import { CartItem } from './database/entities/cart_items.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      password: process.env.DATABASE_PASSWORD,
      username: process.env.DATABASE_USERNAME,
      entities: [Cart, CartItem],
      database: process.env.DATABASE_NAME,
      synchronize: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false
    }
    }),
    AuthModule,
    CartModule,
    OrderModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}
