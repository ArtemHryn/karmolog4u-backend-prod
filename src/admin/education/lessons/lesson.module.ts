import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
