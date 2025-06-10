import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Module } from './schemas/module.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ModuleService {
  constructor(@InjectModel(Module.name) private moduleModel: Model<Module>) {}
  async createModule(data: any) {
    try {
      const newModule = new this.moduleModel(data);
      await newModule.save();
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Не вдалося створити модуль :(');
    }
  }

  async getAllModule(query: {
    searchQuery?: string;
    name?: 1 | -1;
    type?: any;
    access?: any;
    limit?: number;
    page?: number;
  }) {
    const page = +query.page || 1;
    const limit = +query.limit || 10;
    const skip = (page - 1) * limit;

    // Ensure sorting is properly structured
    const sort: Record<string, 1 | -1> = {};
    if (query.name !== undefined) {
      sort.name = query.name; // Apply sorting correctly
    }

    const filters: Record<string, any> = {};
    if (query.type) filters.type = { $in: query.type }; // Supports multiple course types
    if (query.access) filters['access.type'] = { $in: query.access }; // Filters inside the access object

    try {
      return this.moduleModel.aggregate([
        { $match: filters },
        { $sort: Object.keys(sort).length ? sort : { createdAt: -1 } },
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: limit },
              {
                $project: {
                  id: '$_id',
                  _id: 0,
                  name: 1,
                  type: 1,
                  access: 1,
                },
              },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
        {
          $project: {
            data: 1,
            totalPages: {
              $ceil: {
                $divide: [
                  { $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] },
                  limit,
                ],
              },
            },
          },
        },
      ]);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Модулів не знайдено :(');
    }
  }

  async getModuleById(id: any) {
    try {
      return await this.moduleModel
        .findById(id)
        .select('name type access durationInDays')
        // .lean()
        .exec();
    } catch (error) {
      console.log(error);
    }
  }

  async updateModule(data: any) {
    const { id, ...module } = data;
    try {
      await this.moduleModel.findByIdAndUpdate(id, module);
      return { message: 'success' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Помилка в оновленні модулю :(');
    }
  }

  async deleteModule(ids: any) {
    try {
      //check if ids exist in db and return witch exist
      const existingDocs = await this.moduleModel
        .find({ _id: { $in: ids } }, { _id: 1 })
        .lean()
        .exec();
      const existingIds: Types.ObjectId[] = existingDocs.map(
        (doc) => new Types.ObjectId(doc._id),
      );
      if (existingIds.length <= 0) {
        throw new NotFoundException('Помилка, курсів не знайдено');
      }
      await this.moduleModel.deleteMany({
        _id: { $in: existingIds },
      });
      return { message: 'success' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: error.status,
          message: error.response.message,
          error: error.response.error,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }
}
