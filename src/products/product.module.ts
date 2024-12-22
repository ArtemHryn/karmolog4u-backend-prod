// import { ProductService } from './product.service';
// import { ProductController } from './product.controller';
import { Module } from '@nestjs/common';
import { MeditationModule } from './meditations/meditation.module';
import { WebinarModule } from './webinars/webinar.module';

@Module({
  imports: [MeditationModule, WebinarModule],
  controllers: [],
  providers: [],
})
export class ProductModule {}
