import { Module } from '@nestjs/common';
import { MeditationModule } from './meditations/meditation.module';
import { WebinarModule } from './webinars/webinar.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { GuidesAndBooksModule } from './guides_and_books/guides_and_books.module';

@Module({
  imports: [MeditationModule, WebinarModule, GuidesAndBooksModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
