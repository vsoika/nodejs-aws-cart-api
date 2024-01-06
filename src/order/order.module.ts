import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './services';
import { OrderController } from './services/order.controller';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [forwardRef(() => CartModule)],
  providers: [OrderService],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
