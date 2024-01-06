import {
  Controller,
  Put,
  Body,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CartService } from '../../cart/services/cart.service';
import { BasicAuthGuard } from '../../auth';
import { AppRequest, getUserIdFromRequest } from '../../shared';


@Controller('api/order')
export class OrderController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  async createOrder(@Req() req: AppRequest, @Body() body) {
    const userId = getUserIdFromRequest(req);
    const [cart] = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode;

      return {
        statusCode,
        message: 'Cart is empty',
      };
    }

    const { id: cartId, items } = cart;
    const { address } = body;

    const order = this.orderService.create({
      userId,
      cartId,
      items,
      address,
    });

    this.cartService.removeByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order },
    };
  }
}
