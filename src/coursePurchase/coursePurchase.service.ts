import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CoursePurchase,
  CoursePurchaseDocument,
} from './schemas/coursePurchase.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePurchaseDto } from './dto/create-course-purchase.dto';

@Injectable()
export class CoursePurchaseService {
  constructor(
    @InjectModel(CoursePurchase.name)
    private readonly coursePurchaseModel: Model<CoursePurchaseDocument>,
  ) {}

  async addCoursePurchase(data: CreatePurchaseDto) {
    try {
      const { userId, courseId, ...restData } = data;

      const userObjectId = new Types.ObjectId(userId);
      const courseObjectId = new Types.ObjectId(courseId);

      const coursePurchase = new this.coursePurchaseModel({
        userId: userObjectId,
        courseId: courseObjectId,
        ...restData,
      });
      coursePurchase.save();

      if (!coursePurchase) {
        throw new Error();
      }

      return coursePurchase;
    } catch (error) {
      throw new BadRequestException('Помилка запису в БД');
    }
  }

  // async updateCoursePurchase(purchaseId: string, data: UpdatePurchaseDto) {
  //   try {
  //     const updatedPurchase = await this.coursePurchaseModel.findByIdAndUpdate(
  //       new Types.ObjectId(purchaseId),
  //       { $set: data },
  //       { new: true, runValidators: true },
  //     );

  //     if (!updatedPurchase) {
  //       throw new Error();
  //     }

  //     return updatedPurchase;
  //   } catch (error) {
  //     throw new NotFoundException(`Покупку з ід ${purchaseId} не знайдено`);
  //   }
  // }

  async updateStatusCoursePurchase(
    purchaseId: string,
    status: 'ACTIVE' | 'EXPIRED' | 'BLOCKED',
  ) {
    try {
      const updatedPurchase = await this.coursePurchaseModel.findByIdAndUpdate(
        new Types.ObjectId(purchaseId),
        { $set: { status } },
        { new: true, runValidators: true },
      );

      if (!updatedPurchase) {
        throw new Error();
      }

      return updatedPurchase;
    } catch (error) {
      throw new NotFoundException(`Покупку з ід ${purchaseId} не знайдено`);
    }
  }

  async hasAccess(userId: string, productId: string): Promise<boolean> {
    const purchase = await this.coursePurchaseModel
      .findOne({
        user: userId,
        product: productId,
        status: 'active', // якщо є статус
      })
      .lean();

    return !!purchase;
  }

  async getAccessLevel(
    userId: string,
    productId: string,
  ): Promise<'NONE' | 'PARTIAL' | 'FULL'> {
    const purchase = await this.coursePurchaseModel
      .findOne({ user: userId, product: productId })
      .lean();

    if (!purchase) return 'NONE';
    // return purchase.accessLevel ?? 'FULL';
  }
}
