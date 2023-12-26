import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { Cart } from './database/entities/cart.entity';
import { CartItem } from './database/entities/cart_items.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        try {
          const options = {
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: +process.env.DATABASE_PORT,
            password: process.env.DATABASE_PASSWORD,
            username: process.env.DATABASE_USERNAME,
            entities: [Cart, CartItem],
            database: process.env.DATABASE_NAME,
            synchronize: false,
            logging: ["query", "error"],
            maxQueryExecutionTime: 1000,
            // extra: {
            // //   poolSize: 1000,
            //   connectionTimeoutMillis: 100000,
            //   query_timeout: 100000,
            //   statement_timeout: 100000
            // },
            ssl: {
              rejectUnauthorized: false,
            },
          } as TypeOrmModuleOptions;

          console.log(' process.env',  process.env);

          return options;
        } catch (err) {
          console.log('typeorm error', err);
        }
      },
      inject: [ConfigService],
    }),
    AuthModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
