import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { User } from 'src/common/decorators/user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('create')
  create(@Body() dto: any, @User() user?: any) {
    return this.service.createPayment(dto, user);
  }

  @Post('callback')
  callback(@Body() body: any) {
    return this.service.handleCallback(body);
  }
}
