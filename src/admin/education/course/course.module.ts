import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import { ContractModule } from '../contract/contract.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    ContractModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService, MongooseModule],
})
export class CourseModule {}
