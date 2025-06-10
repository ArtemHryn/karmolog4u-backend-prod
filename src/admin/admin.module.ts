import { Module } from '@nestjs/common';
import { AdminProductModule } from './products/admin-product.module';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { UserModule } from './user/user.module';
import { CourseModule } from './education/course/course.module';
import { ModuleModule } from './education/module/module.module';

@Module({
  imports: [
    UserModule,
    AdminProductModule,
    PromoCodeModule,
    CourseModule,
    ModuleModule,
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}
