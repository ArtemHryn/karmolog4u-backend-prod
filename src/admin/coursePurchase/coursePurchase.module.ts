import { CoursePurchaseController } from './coursePurchase.controller';
import { Module } from '@nestjs/common';
import { CoursePurchaseService } from './coursePurchase.service';
import { CourseModule } from '../education/course/course.module';
import { CoursePurchaseModule as PurchaseModule } from 'src/coursePurchase/coursePurchase.module';
import { LessonModule } from '../education/lessons/lesson.module';

@Module({
  imports: [CourseModule, PurchaseModule, LessonModule],
  controllers: [CoursePurchaseController],
  providers: [CoursePurchaseService],
})
export class CoursePurchaseModule {}
