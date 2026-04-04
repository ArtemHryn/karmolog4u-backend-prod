import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-purchase.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/user/dto/user-entity.dto';
import { PaymentCallbackDto } from './dto/payment-callback.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('product/create')
  @ApiOperation({ summary: 'Create payment for product' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  create(@Body() dto: CreatePaymentDto, @User() user?: UserEntity) {
    return this.service.createPayment(dto, user);
  }

  @Post('callback')
  @ApiOperation({ summary: 'Payment provider callback (WayForPay)' })
  @ApiBody({ type: PaymentCallbackDto })
  @ApiResponse({ status: 200, description: 'Callback processed' })
  callback(@Body() body: PaymentCallbackDto) {
    return this.service.handleCallback(body);
  }
}
