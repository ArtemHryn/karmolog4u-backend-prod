import { MongooseModule } from '@nestjs/mongoose';
import { DiscountService } from './discount.service';
import { Module } from '@nestjs/common';
import { Discount, DiscountSchema } from './schemas/discount.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discount.name, schema: DiscountSchema },
    ]),
  ],
  controllers: [],
  providers: [DiscountService],
  exports: [DiscountService, MongooseModule],
})
export class DiscountModule {}
