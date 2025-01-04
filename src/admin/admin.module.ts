import { Module } from '@nestjs/common';
import { AdminUserModule } from './user/admin-user.module';
import { AdminProductModule } from './products/admin-product.module';
import { PromoCodeModule } from './promo-code/promo-code.module';

@Module({
  imports: [AdminUserModule, AdminProductModule, PromoCodeModule],
  controllers: [],
  providers: [],
})
export class AdminModule {}
