import { DeletedService } from './deleted.service';
import { DiscountModule } from '../discount/discount.module';
import { AdminGuidesAndBooksModule } from '../guides_and_books/admin-guides_and_books.module';
import { AdminMeditationModule } from '../meditations/admin-meditation.module';
import { AdminWebinarsModule } from '../webinars/admin-webinars.module';
import { DeletedController } from './deleted.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    AdminMeditationModule,
    DiscountModule,
    AdminWebinarsModule,
    AdminGuidesAndBooksModule,
  ],
  controllers: [DeletedController],
  providers: [DeletedService],
})
export class DeletedModule {}
