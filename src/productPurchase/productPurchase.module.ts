import { Module } from '@nestjs/common';
import {
  ProductPurchase,
  ProductPurchaseSchema,
} from './schemas/productPurchase.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductPurchase.name, schema: ProductPurchaseSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [MongooseModule],
})
export class ProductPurchaseModule {}
