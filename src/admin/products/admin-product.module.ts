import { Module } from '@nestjs/common';
import { AdminMeditationModule } from './meditations/admin-meditation.module';
import { AdminProductController } from './admin-product.controller';
import { DiscountModule } from './discount/discount.module';
import { AdminWebinarsModule } from './webinars/admin-webinars.module';
import { AdminGuidesAndBooksModule } from './guides_and_books/admin-guides_and_books.module';

@Module({
  imports: [
    AdminMeditationModule,
    DiscountModule,
    AdminWebinarsModule,
    AdminGuidesAndBooksModule,
  ],
  controllers: [AdminProductController],
  providers: [],
  exports: [],
})
export class AdminProductModule {}
