import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from 'src/admin/education/course/schemas/course.schema';
import { Lesson } from 'src/admin/education/lessons/schemas/lesson.schema';
import { Module } from 'src/admin/education/module/schemas/module.schema';
import { CoursePurchase } from 'src/coursePurchase/schemas/coursePurchase.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(CoursePurchase.name)
    private coursePurchaseModel: Model<CoursePurchase>,
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
    @InjectModel(Module.name) private moduleModel: Model<Module>,
  ) {}

  async getCourseDetail(userId: any, courseId: any) {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Курс не знайдено');
    }
    const cleanCourse = course.toObject({ versionKey: false, virtuals: true });

    const purchase = await this.coursePurchaseModel.findOne({
      userId,
      courseId,
    });
    if (!purchase) {
      throw new ForbiddenException('Цей курс не куплений користувачем');
    }

    return {
      ...cleanCourse,
      purchaseInfo: purchase,
    };
  }

  async getLessonsSSK(userId: any, courseId: any) {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Курс не знайдено');
    }
    if (
      !['SSK_INDEPENDENT', 'SSK_WITH_CURATOR', 'SSK_WITH_SERGIY'].includes(
        course.type,
      )
    ) {
      throw new BadRequestException('Курс не відповідає типу ССК');
    }
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

    const modules = await this.moduleModel.aggregate([
      {
        $match: { course: new Types.ObjectId(courseId) }, // вибірка модулів по курсу
      },
      {
        $lookup: {
          from: 'lessons',
          let: { moduleId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$targetModel', 'Module'] },
                    { $eq: ['$targetId', '$$moduleId'] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                moduleDay: 1,
                modulePart: 1,
                name: 1,
              },
            },
          ],
          as: 'lessonsList',
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          type: 1,
          durationInDays: 1,
          access: 1,
          lessonsList: 1,
        },
      },
    ]);
    if (modules.length == 0) {
      throw new NotFoundException('Модулів не знайдено');
    }
    return modules;
  }

  async getLesson(userId: any, lessonId: string) {
    const now = new Date();

    // 1. Find lesson by ID
    const lesson = await this.lessonModel.findById(lessonId);
    if (!lesson) throw new NotFoundException('Lesson not found');

    // 2. Check lesson.access.type = TO_DATE

    if (lesson.targetModel === 'Module') {
      if (lesson.access?.type === 'TO_DATE') {
        if (
          !lesson.access.dateStart ||
          !lesson.access.dateEnd ||
          now < lesson.access.dateStart ||
          now > lesson.access.dateEnd
        ) {
          throw new ForbiddenException('Lesson is not available by date');
        }
      }
      // ---- TARGET: MODULE ----
      const module = await this.moduleModel.findById(lesson.targetId).lean();
      if (!module) throw new NotFoundException('Module not found');

      if (now < module.access.dateStart || now > module.access.dateEnd) {
        throw new ForbiddenException('Module is not available by date');
      }

      const purchase = await this.coursePurchaseModel.findOne({
        userId,
        courseId: module.course,
      });

      if (!purchase)
        throw new ForbiddenException('No course purchase for module found');

      if (!(now > purchase.accessStartDate) || !(now < purchase.availableTo)) {
        throw new ForbiddenException(
          'Course access expired or not started yet',
        );
      }

      return lesson; // ✅ доступ є
    }

    // 3. Check by targetModel
    if (lesson.targetModel === 'Course') {
      // ---- TARGET: COURSE ----
      const course = await this.courseModel.findById(lesson.targetId);
      if (!course) {
        throw new NotFoundException('Курс не знайдено');
      }
      const purchase = await this.coursePurchaseModel.findOne({
        userId,
        courseId: course._id,
      });

      if (!purchase)
        throw new NotFoundException('No purchase found for this course');

      if (now < purchase.accessStartDate || now > purchase.availableTo) {
        throw new ForbiddenException(
          'Course access period expired or not started',
        );
      }

      if (purchase.paymentPlan === 'PARTIAL') {
        if (purchase.lessonsUnlocked?.some((id) => id.equals(lesson._id))) {
          throw new ForbiddenException('Lesson is locked for partial payment');
        }
      }

      return lesson; // ✅ доступ є
    }

    throw new ForbiddenException('Unknown targetModel in lesson');
  }
}
