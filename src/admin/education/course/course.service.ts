import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { ContractService } from '../contract/contract.service';
import { StorageService } from 'src/storage/storage.service';
import { isValidUrl } from 'src/common/helper/validateUrl';
import { ConfigService } from '@nestjs/config';
import { coverCompress } from 'src/common/helper/coverCompress';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private readonly contractService: ContractService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {}

  async createCourse(data: CreateCourseDto) {
    try {
      const { contract, cover, optionalFiles, ...course } = data;
      const contractID = await this.contractService.createContract(contract);

      const newCourse = new this.courseModel({
        ...course,
        contract: contractID.id,
      });
      await newCourse.save();
      if (!newCourse) {
        throw new Error('Помилка створення курсу :(');
      }

      const folderPath = await this.storageService.createCourseStorage(
        newCourse._id.toString(),
      );

      const updateData: Record<string, any> = {}; // Store all updates

      if (isValidUrl(cover)) {
        const coverLink = await coverCompress(
          cover,
          this.storageService.getSubFolderPath(folderPath, 'covers'),
          this.configService,
        );
        updateData.cover = coverLink; // Add cover update
      }

      if (optionalFiles?.length != 0) {
        const filesLink = await this.storageService.moveFiles(
          optionalFiles,
          this.storageService.getTempFilesFolder(),
          this.storageService.getSubFolderPath(folderPath, 'materials'),
        );
        updateData.optionalFiles = filesLink; // Add optionalFiles update
      }

      if (Object.keys(updateData).length > 0) {
        await this.courseModel.findByIdAndUpdate(newCourse._id, {
          $set: updateData,
        });
      }

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || 500,
          message:
            error.response?.message ||
            'An error occurred while processing the file',
          error: error.response?.error || 'Internal Server Error',
        },
        error.status || 500,
        {
          cause: error,
        },
      );
    }
  }

  async getAllCourse(query: {
    searchQuery?: string;
    status?: string;
    name?: 1 | -1;
    type?: 1 | -1;
    access?: 1 | -1;
    completeness?: 1 | -1;
    limit?: number;
    page?: number;
  }) {
    const page = +query.page || 1;
    const limit = +query.limit || 10;
    const skip = (page - 1) * limit;

    const sortFields = ['name', 'type', 'access', 'completeness'] as const;

    const sort = sortFields.reduce((acc, field) => {
      const value = Number(query[field]);
      if (query[field] !== undefined) {
        const sortKey = field === 'access' ? 'access.type' : field;
        acc[sortKey] = value;
      }
      return acc;
    }, {} as Record<number, 1 | -1>);

    try {
      return await this.courseModel.aggregate([
        {
          $match: { status: query.status }, // Filter for webinars
        },
        {
          $project: {
            id: '$_id',
            name: 1,
            type: 1,
            stream: 1,
            access: 1,
            completeness: 1,
            _id: 0,
          },
        },
        ...(query.searchQuery
          ? [
              {
                $match: {
                  $or: [{ name: { $regex: query.searchQuery, $options: 'i' } }],
                },
              },
            ]
          : []),
        ...(Object.keys(sort).length ? [{ $sort: sort }] : []),
        {
          $facet: {
            paginatedData: [
              { $skip: skip }, // Apply skip for pagination
              { $limit: limit }, // Apply limit for pagination
            ],
            totalCount: [
              { $count: 'count' }, // Count the total number of documents
            ],
          },
        },
        {
          $project: {
            data: '$paginatedData', // Paginated data
            totalPages: {
              $ceil: {
                $divide: [{ $arrayElemAt: ['$totalCount.count', 0] }, limit],
              },
            }, // Calculate total pages
          },
        },
      ]);
    } catch (error) {
      throw new BadRequestException('Помилка у запиті на пошук курсу :(');
    }
  }

  async getCourseById(data: any) {
    try {
      return await this.courseModel
        .findById(data)
        .populate({
          path: 'contract',
          populate: {
            path: 'points', // якщо points — це ObjectId[] в контракті
          },
        })
        .exec();
    } catch (error) {
      throw new NotFoundException(`Помилка, курсу з ${data} не знайдено :(`);
    }
  }

  async updateCourse(data: any) {
    try {
      const [id, contract = {}, ...course] = data;
      //update contract if available
      if (Object.keys(contract).length != 0) {
        const contractId = await this.courseModel.findById(id, 'contract');
        await this.contractService.updateContract({
          id: contractId,
          ...contract,
        });
      }
      if (Object.keys(course).length != 0) {
        await this.courseModel.findByIdAndUpdate(id, course, {
          new: true, // Return the updated document
          runValidators: true, // Run validation checks
        });
      }
      return { message: 'success' };
    } catch (error) {
      throw new BadRequestException('Помилка в оновленні курсу :(');
    }
  }

  async deleteCourse(data: any) {
    try {
      const contractIds = await this.courseModel
        .find({ _id: { $in: data } })
        .select('contract');
      await this.contractService.deleteContract(contractIds);
      await this.courseModel.deleteMany({
        _id: { $in: data },
      });

      return;
    } catch (error) {
      throw new NotFoundException('Помилка, курсів не знайдено');
    }
  }

  async updateStatusCourse(data: any) {
    const [id, ...status] = data;
    try {
      await this.courseModel.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, runValidators: true },
      );
      return;
    } catch (error) {
      throw new NotFoundException('Помилка, курсів не знайдено');
    }
  }
}
