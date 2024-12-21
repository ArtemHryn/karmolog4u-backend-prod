import { WebinarsService } from './webinars.service';
import { WebinarsController } from './webinars.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [WebinarsController],
  providers: [WebinarsService],
})
export class WebinarsModule {}
