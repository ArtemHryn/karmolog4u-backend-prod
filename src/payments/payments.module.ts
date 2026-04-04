import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from './schemas/purchase.schema';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ProductModule } from 'src/products/product.module';
import { ProductPurchaseModule } from 'src/productPurchase/productPurchase.module';
import { UserModule } from 'src/user/user.module';
import { DiscountModule } from 'src/admin/products/discount/discount.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Purchase.name, schema: PurchaseSchema },
    ]),
    ProductModule,
    ProductPurchaseModule,
    UserModule,
    DiscountModule,
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
