import { Module } from '@nestjs/common';
import { ProductPurchaseModule as PurchaseModule } from 'src/productPurchase/productPurchase.module';
import { ProductPurchaseController } from './productPurchase.controller';
import { ProductPurchaseService } from './productPurchase.service';

@Module({
  imports: [PurchaseModule],
  controllers: [ProductPurchaseController],
  providers: [ProductPurchaseService],
})
export class ProductPurchaseModule {}
