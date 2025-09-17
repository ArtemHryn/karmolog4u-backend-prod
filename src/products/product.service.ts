import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Webinar } from 'src/admin/products/webinars/schemas/webinars.schema';
import { GuidesAndBooks } from 'src/admin/products/guides_and_books/schemas/guides_and_books.schema';
import { Meditation } from './meditations/schemas/meditation.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Webinar.name) private webinarModel: Model<Webinar>,
    @InjectModel(Meditation.name) private meditationModel: Model<Meditation>,
    @InjectModel(GuidesAndBooks.name)
    private guidesAndBooksModel: Model<GuidesAndBooks>,
  ) {}

  async getProductDetails(productId: string) {
    const id = new Types.ObjectId(productId);

    // Пробуємо знайти у вебінарах
    const webinar = await this.webinarModel.findById(id).lean();
    if (webinar) {
      return webinar;
    }

    // Пробуємо знайти у медитаціях
    const meditation = await this.meditationModel.findById(id).lean();
    if (meditation) {
      return meditation;
    }

    // Пробуємо знайти у гайдах
    const guide = await this.guidesAndBooksModel.findById(id).lean();
    if (guide) {
      return guide;
    }

    throw new NotFoundException(`Продукт з id ${productId} не знайдено`);
  }

  async getAllProductsWithPrice() {
    const meditations = await this.meditationModel.aggregate([
      { $match: { price: { $exists: true, $ne: null } } },
      {
        $project: {
          id: '$_id',
          cover: 1,
          name: '$name.uk',
          _id: 0,
        },
      },
    ]);

    const webinars = await this.webinarModel.aggregate([
      { $match: { price: { $exists: true, $ne: null } } },
      {
        $project: {
          id: '$_id',
          cover: 1,
          name: '$name.uk',
          _id: 0,
        },
      },
    ]);

    const guides = await this.guidesAndBooksModel.aggregate([
      { $match: { price: { $exists: true, $ne: null } } },
      {
        $project: {
          id: '$_id',
          cover: 1,
          name: '$name.uk',
          _id: 0,
        },
      },
    ]);

    // об'єднати всі результати в один масив
    return [...meditations, ...webinars, ...guides];
  }
}
