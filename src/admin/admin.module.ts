import { Module } from '@nestjs/common';
import { AdminProductModule } from './products/admin-product.module';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AdminProductModule, PromoCodeModule],
  controllers: [],
  providers: [],
})
export class AdminModule {}
