import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/admin/education/course/schemas/course.schema';
import { Lesson } from 'src/admin/education/lessons/schemas/lesson.schema';
import { CoursePurchase } from 'src/coursePurchase/schemas/coursePurchase.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(CoursePurchase.name)
    private coursePurchaseModel: Model<CoursePurchase>,
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
  ) {}

  async getCourseDetail(userId: any, courseId: any) {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Курс не знайдено');
    }

    const purchase = await this.coursePurchaseModel.findOne({
      userId,
      courseId,
    });
    if (!purchase) {
      throw new ForbiddenException('Цей курс не куплений користувачем');
    }

    return {
      ...course,
      purchaseInfo: purchase,
    };
  }

  async getLessonsSSK(userId: any, courseId: any) {
    const purchase = await this.coursePurchaseModel.findOne({
      userId,
      courseId,
    });
    if (!purchase) {
      throw new ForbiddenException('Цей курс не куплений користувачем');
    }

    const lessons = await this.lessonModel.find(
      { targetId: courseId, targetModel: 'Course' },
      '_id name internalDescription',
    );
    if (!lessons) {
      throw new NotFoundException('Уроків не знайдено');
    }

    const unlockedIds = new Set(
      purchase.lessonsUnlocked.map((l) => String(l._id)),
    );

    return lessons.map((lesson) => ({
      id: lesson._id,
      name: lesson.name,
      internalDescription: lesson.internalDescription,
      isAvailable: unlockedIds.has(String(lesson._id)),
    }));
  }

  async getLessonsList(userId: any, courseId: any) {
    const purchase = await this.coursePurchaseModel.findOne({
      userId,
      courseId,
    });
    if (!purchase) {
      throw new ForbiddenException('Цей курс не куплений користувачем');
    }

    //search modules
    //return all modules with lessons
  }

  async getLesson() {
    // search lesson
    //if lesson.access.type ==  'TO_DATE'
    //lesson.access.dateStart < date now > lesson.access.dateEnd
    //else
    // if target model course (ssk)
    // course purchase search by targetId
    //if
    // availableTo > now date, accessStartDate < now date
    //if
    // paymentPlan = PARTIAL
    // check lessonsUnlocked
    //return lesson
    //
    //
    // if target 'module'
    // search module by target id
    //if
    // module.access.dateStart < date now >module.access.dateEnd
    //search course purchase by user id and module.course
    //if
    // availableTo > now date, accessStartDate < now date
    //return lesson
  }
}
