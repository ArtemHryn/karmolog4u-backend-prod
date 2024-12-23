import { Module } from '@nestjs/common';
import { AdminUserModule } from './user/admin-user.module';
import { AdminProductModule } from './products/admin-product.module';

@Module({
  imports: [AdminUserModule, AdminProductModule],
  controllers: [],
  providers: [],
})
export class AdminModule {}
