import { CourseModule as Course } from 'src/admin/education/course/course.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Module } from '@nestjs/common';
import { CoursePurchaseModule } from 'src/coursePurchase/coursePurchase.module';
import { LessonModule } from 'src/admin/education/lessons/lesson.module';
import { HasCourseGuard } from './guard/hasCourseGuard';

@Module({
  imports: [Course, CoursePurchaseModule, LessonModule],
  controllers: [CourseController],
  providers: [CourseService, HasCourseGuard],
})
export class CourseModule {}
