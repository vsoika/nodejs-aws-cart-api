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
            // variable names are unique for connection to RDS from the Elastic Beanstalk env
            // https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.managing.db.html
            host: process.env.RDS_HOSTNAME,
            port: +process.env.RDS_PORT,
            password: process.env.RDS_PASSWORD,
            username: process.env.RDS_USERNAME,
            entities: [Cart, CartItem],
            database: process.env.RDS_DB_NAME,
            synchronize: false,
            logging: ['query', 'error'],
            maxQueryExecutionTime: 1000,
            ssl: {
              rejectUnauthorized: false,
            },
          } as TypeOrmModuleOptions;

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
