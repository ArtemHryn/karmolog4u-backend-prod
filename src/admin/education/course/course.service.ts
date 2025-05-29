import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { ContractService } from '../contract/contract.service';
import { StorageService } from 'src/storage/storage.service';
import { ConfigService } from '@nestjs/config';
import { coverCompress } from 'src/common/helper/coverCompress';
import {
  getFileNameFromUrl,
  getFileNamesFromUrls,
} from 'src/common/helper/getFileNameFromUrl';
import { getDifference } from 'src/common/helper/getDifferenceArray';
import { UpdateCourseDto } from './dto/update-course.dto';

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

      //cerate contract
      const contractID = await this.contractService.createContract(contract);
      //create course
      const newCourse = new this.courseModel({
        ...course,
        contract: contractID.id,
      });
      await newCourse.save();
      if (!newCourse) {
        throw new Error('Помилка створення курсу :(');
      }
      //create folder to course material
      const folderPath = await this.storageService.createCourseStorage(
        newCourse._id.toString(),
      );

      const updateData: Record<string, any> = {}; // Store all updates

      if (cover) {
        //get name from url
        const coverName = getFileNameFromUrl(cover);
        //check exist
        const fileExist = await this.storageService.fileExists(
          this.storageService.getTempCoversFolder(),
          coverName,
        );
        //if exist, compress
        if (fileExist) {
          const coverLink = await coverCompress(
            cover,
            this.storageService.getSubFolderPath(folderPath, 'covers'),
            this.configService,
          );
          // add cover link to update
          updateData.cover = coverLink; // Add cover update
        }
      }

      if (optionalFiles?.length > 0) {
        // get array of name
        const fileNames = getFileNamesFromUrls(optionalFiles);
        //check exist
        const existingFiles = await this.storageService.filterExistingFiles(
          this.storageService.getTempFilesFolder(),
          fileNames,
        );
        //if exist, copy
        if (existingFiles.length > 0) {
          const filesLink = await this.storageService.copyFiles(
            this.storageService.getTempFilesFolder(),
            this.storageService.getSubFolderPath(folderPath, 'materials'),
            existingFiles,
          );
          await this.storageService.deleteFiles(
            this.storageService.getTempFilesFolder(),
            existingFiles,
          );
          //add file link to update
          updateData.optionalFiles = filesLink; // Add optionalFiles update
        }
      }
      // update course document with new cover & files
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
    type?: any;
    access?: any;
    completeness?: any;
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

    // Construct the filter object dynamically
    const filters: Record<string, any> = {};
    if (query.status) filters.status = query.status;
    if (query.type) filters.type = { $in: query.type }; // Supports multiple course types
    if (query.access) filters['access.type'] = { $in: query.access }; // Filters inside the access object
    if (query.completeness) filters.completeness = { $in: query.completeness }; // Supports multiple completeness values

    try {
      const STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVE'];
      return await this.courseModel.aggregate([
        {
          $facet: {
            paginatedData: [
              { $match: filters }, // Apply filters only to paginated data
              {
                $project: {
                  id: '$_id',
                  name: 1,
                  status: 1,
                  stream: 1,
                  access: 1,
                  completeness: 1,
                  chat: 1,
                  _id: 0,
                },
              },
              ...(query.searchQuery
                ? [
                    {
                      $match: {
                        $or: [
                          {
                            name: { $regex: query.searchQuery, $options: 'i' },
                          },
                        ],
                      },
                    },
                  ]
                : []),
              ...(Object.keys(sort).length ? [{ $sort: sort }] : []),
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [{ $match: filters }, { $count: 'count' }], // Total count respects filters
            statusCounts: [
              {
                $group: {
                  _id: '$status', // Count all statuses across the collection (no filtering)
                  count: { $sum: 1 },
                },
              },
              {
                $project: {
                  status: '$_id',
                  count: 1,
                  _id: 0,
                },
              },
              {
                $group: {
                  _id: null,
                  statusMap: { $push: { k: '$status', v: '$count' } },
                },
              },
              {
                $project: {
                  _id: 0,
                  statusCounters: {
                    $map: {
                      input: STATUSES,
                      as: 'status',
                      in: {
                        status: '$$status',
                        count: {
                          $ifNull: [
                            {
                              $toInt: {
                                $getField: {
                                  field: '$$status',
                                  input: { $arrayToObject: '$statusMap' },
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        },
        {
          $project: {
            data: '$paginatedData',
            totalPages: {
              $ceil: {
                $divide: [{ $arrayElemAt: ['$totalCount.count', 0] }, limit],
              },
            },
            statusCounters: '$statusCounts', // Moved outside filtering, ensuring global status counts
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

  async updateCourse(id: mongoose.Types.ObjectId, data: UpdateCourseDto) {
    try {
      const { contract, ...newCourse } = data;
      //search course
      const oldCourse = await this.courseModel.findById(id).exec();
      if (!oldCourse) {
        throw new NotFoundException('Курс не знайдено :(');
      }
      if (
        (newCourse?.cover && oldCourse.cover !== newCourse?.cover) ||
        newCourse.cover == ''
      ) {
        //if old cover true, delete
        if (oldCourse.cover) {
          const oldCoverName = getFileNameFromUrl(oldCourse.cover);
          await this.storageService.deleteFiles(
            this.storageService.getCourseFilePath(id.toHexString(), 'covers'),
            [oldCoverName],
          );
        }
        //if new cover, add to course folder
        if (newCourse.cover) {
          const coverName = getFileNameFromUrl(newCourse.cover);
          const fileExist = await this.storageService.fileExists(
            this.storageService.getTempCoversFolder(),
            coverName,
          );
          if (fileExist) {
            const coverLink = await coverCompress(
              newCourse.cover,
              this.storageService.getCourseFilePath(id.toHexString(), 'covers'),
              this.configService,
            );
            newCourse.cover = coverLink;
          }
        }
      }
      //check difference between old & new array of files
      const difference = getDifference(
        oldCourse.optionalFiles,
        newCourse?.optionalFiles || [],
        getFileNameFromUrl,
      );
      //delete file witch not exist in new data course
      if (difference.onlyInArr1.length != 0) {
        await this.storageService.deleteFiles(
          this.storageService.getCourseFilePath(id.toHexString(), 'materials'),
          difference.onlyInArr1,
        );
      }
      //add files to course folder if exist
      if (difference.onlyInArr2.length != 0) {
        const existingFiles = await this.storageService.filterExistingFiles(
          this.storageService.getTempFilesFolder(),
          difference.onlyInArr2,
        );
        if (existingFiles.length > 0) {
          const newFiles = await this.storageService.copyFiles(
            this.storageService.getTempFilesFolder(),
            this.storageService.getCourseFilePath(
              id.toHexString(),
              'materials',
            ),
            existingFiles,
          );
          //delete files from temp folder
          await this.storageService.deleteFiles(
            this.storageService.getTempFilesFolder(),
            existingFiles,
          );
          //concat old and new file links to course
          newCourse.optionalFiles = difference.inBoth.concat(newFiles);
        }
      }

      // update contract if available
      if (Object.keys(contract).length != 0) {
        const course = await this.courseModel.findById(id).select('contract');

        if (!course?.contract)
          throw new NotFoundException('Contract not found in course');

        await this.contractService.updateContract({
          id: course.contract._id,
          contract,
        });
      }
      if (Object.keys(newCourse).length != 0) {
        await this.courseModel.findByIdAndUpdate(id, newCourse, {
          new: true, // Return the updated document
          runValidators: true, // Run validation checks
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

  async deleteCourse(data: any) {
    try {
      console.log(data);

      //check if ids exist in db and return witch exist
      const existingDocs = await this.courseModel
        .find({ _id: { $in: data } }, { _id: 1 })
        .lean()
        .exec();
      const existingIds: Types.ObjectId[] = existingDocs.map(
        (doc) => new Types.ObjectId(doc._id),
      );
      if (existingIds.length <= 0) {
        throw new NotFoundException('Помилка, курсів не знайдено');
      }
      //search array of contract ids
      const contractIds = await this.courseModel
        .find({ _id: { $in: existingIds } })
        .select('contract');
      //delete contract by array of contract id
      await this.contractService.deleteContract(contractIds);
      //delete course by array of existing course id
      await this.courseModel.deleteMany({
        _id: { $in: existingIds },
      });
      //delete course folder by exist id
      await this.storageService.deleteCourseFolder(existingIds);

      return { message: 'success' };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: error.status || 500,
          message:
            error.response?.message ||
            'An error occurred while processing the course',
          error: error.response?.error || 'Internal Server Error',
        },
        error.status || 500,
        {
          cause: error,
        },
      );
    }
  }

  async updateStatusCourse(data: any) {
    const { id, ...status } = data;
    try {
      const exists = await this.courseModel.exists({ _id: id });
      if (!exists) {
        throw new NotFoundException(`Курсу з ід "${id}" не знайдено`);
      }
      await this.courseModel.findByIdAndUpdate(
        id,
        { $set: { ...status } },
        { new: true, runValidators: true },
      );
      return { message: 'success' };
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || 500,
          message:
            error.response?.message ||
            'An error occurred while processing the course',
          error: error.response?.error || 'Internal Server Error',
        },
        error.status || 500,
        {
          cause: error,
        },
      );
    }
  }
}
