import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Webinar } from '../webinars/schemas/webinars.schema';
import mongoose, { Connection, Model } from 'mongoose';
import { Discount } from '../discount/schemas/discount.schema';
import { GuidesAndBooks } from '../guides_and_books/schemas/guides_and_books.schema';
import { Meditation } from 'src/products/meditations/schemas/meditation.schema';
import { GetAllResponseDto } from './dto/get-all.dto';
import { RestoreDto } from './dto/restore.dto';
import { ResponseSuccessDto } from 'src/common/dto/response-success.dto';
import { DeleteForeverDto } from './dto/delete-forever.dto';

@Injectable()
export class DeletedService {
  constructor(
    @InjectModel(Webinar.name) private webinarModel: Model<Webinar>,
    @InjectModel(Meditation.name) private meditationModel: Model<Meditation>,
    @InjectModel(Discount.name) private discountModel: Model<Discount>,
    @InjectModel(GuidesAndBooks.name)
    private guidesAndBooksModel: Model<GuidesAndBooks>,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  async getAll(
    searchQuery: string,
    page: number,
    limit: number,
  ): Promise<GetAllResponseDto[]> {
    try {
      const skip = (page - 1) * limit;

      return await this.webinarModel.aggregate([
        {
          $match: { toDelete: true }, // Filter for webinars
        },
        {
          $addFields: { section: 'Вебінари', collection: 'webinars' }, // Add the collection name to each document
        },
        {
          $project: {
            id: '$_id', // Змінюємо назву поля _id на id
            category: 1,
            'name.uk': 1,
            expiredAt: 1,
            section: 1,
            collection: 1,
            _id: 0, // Прибираємо оригінальне поле _id
          },
        },
        {
          $unionWith: {
            coll: 'meditations', // Union with the 'meditation' collection
            pipeline: [
              { $match: { toDelete: true } },
              {
                $addFields: { section: 'Медитації', collection: 'meditations' }, // Add the collection name to each document
              },
              {
                $project: {
                  id: '$_id', // Змінюємо назву поля _id на id
                  category: 1,
                  'name.uk': 1,
                  expiredAt: 1,
                  section: 1,
                  collection: 1,
                  _id: 0, // Прибираємо оригінальне поле _id
                },
              },
            ], // Filter for meditation
          },
        },
        {
          $unionWith: {
            coll: 'guidesandbooks', // Union with the 'guidesandbooks' collection
            pipeline: [
              { $match: { toDelete: true } },
              {
                $addFields: {
                  section: 'Гайди та книги',
                  collection: 'guidesAndBooks',
                }, // Add the collection name to each document
              },
              {
                $project: {
                  id: '$_id', // Змінюємо назву поля _id на id
                  category: 1,
                  'name.uk': 1,
                  expiredAt: 1,
                  section: 1,
                  collection: 1,
                  _id: 0, // Прибираємо оригінальне поле _id
                },
              },
            ], // Filter for guides and books
          },
        },
        // Add the $search stage for searchQuery (if provided)
        ...(searchQuery
          ? [
              {
                $match: {
                  $or: [
                    { 'name.ru': { $regex: searchQuery, $options: 'i' } }, // Пошук в "name.ru"
                    { 'name.uk': { $regex: searchQuery, $options: 'i' } }, // Пошук в "name.uk"
                    { section: { $regex: searchQuery, $options: 'i' } },
                  ],
                },
              },
            ]
          : []),
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
            totalProducts: {
              $arrayElemAt: ['$totalCount.count', 0], // Total count of products
            },
          },
        },
      ]);
    } catch (error) {
      throw new NotFoundException('Видалених продуктів не знайдено');
    }
  }
  async restoreProducts(data: RestoreDto[]): Promise<ResponseSuccessDto> {
    try {
      const { webinars, meditation, guidesAndBooks } = data.reduce(
        (acc, item) => {
          if (item.collection === 'webinars') {
            acc.webinars.push(new mongoose.Types.ObjectId(item.id.toString()));
          } else if (item.collection === 'meditations') {
            acc.meditation.push(
              new mongoose.Types.ObjectId(item.id.toString()),
            );
          } else if (item.collection === 'guidesAndBooks') {
            acc.guidesAndBooks.push(
              new mongoose.Types.ObjectId(item.id.toString()),
            );
          }
          return acc;
        },
        {
          webinars: [],
          meditation: [],
          guidesAndBooks: [],
        },
      );

      if (webinars.length !== 0) {
        await this.webinarModel.updateMany(
          { _id: { $in: webinars } },
          {
            $set: { toDelete: false },
          },
        );
      }
      if (meditation.length !== 0) {
        await this.meditationModel.updateMany(
          { _id: { $in: meditation } },
          {
            $set: { toDelete: false },
          },
        );
      }
      if (guidesAndBooks.length !== 0) {
        await this.guidesAndBooksModel.updateMany(
          { _id: { $in: guidesAndBooks } },
          {
            $set: { toDelete: false },
          },
        );
      }
      return { message: 'success' };
    } catch (error) {
      throw new BadRequestException('щось пішло не так');
    }
  }

  async deleteProducts(data: DeleteForeverDto[]): Promise<ResponseSuccessDto> {
    try {
      const { webinars, meditation, guidesAndBooks } = data.reduce(
        (acc, item) => {
          if (item.collection === 'webinars') {
            acc.webinars.push(new mongoose.Types.ObjectId(item.id.toString()));
          } else if (item.collection === 'meditations') {
            acc.meditation.push(
              new mongoose.Types.ObjectId(item.id.toString()),
            );
          } else if (item.collection === 'guidesAndBooks') {
            acc.guidesAndBooks.push(
              new mongoose.Types.ObjectId(item.id.toString()),
            );
          }
          return acc;
        },
        {
          webinars: [],
          meditation: [],
          guidesAndBooks: [],
        },
      );

      if (webinars.length !== 0) {
        await this.webinarModel.deleteMany(
          { _id: { $in: webinars } },
          {
            $set: { toDelete: false },
          },
        );
      }
      if (meditation.length !== 0) {
        await this.meditationModel.deleteMany(
          { _id: { $in: meditation } },
          {
            $set: { toDelete: false },
          },
        );
      }
      if (guidesAndBooks.length !== 0) {
        await this.guidesAndBooksModel.deleteMany(
          { _id: { $in: guidesAndBooks } },
          {
            $set: { toDelete: false },
          },
        );
      }
      return { message: 'success' };
    } catch (error) {
      throw new BadRequestException('щось пішло не так');
    }
  }
}
