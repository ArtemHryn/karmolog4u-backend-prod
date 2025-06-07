import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Files } from 'src/files/schemas/files.schema';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(Files.name) private readonly fileModel: Model<Files>,
  ) {}
  async createFiles(filesData: any[]) {
    try {
      const createdFiles = await this.fileModel.insertMany(filesData);
      return createdFiles;
    } catch (error) {
      throw new BadRequestException('Не вдалося додати файли :(');
    }
  }

  async getFiles(targetModel: string, targetId: any) {
    try {
      return await this.fileModel.find({ targetModel, targetId });
    } catch (error) {}
  }

  async deleteFiles(fileIds: any[]) {
    try {
      await this.fileModel.deleteMany({ _id: { $in: fileIds } });
      return { message: 'success' };
    } catch (error) {
      throw new BadRequestException('Не вдалося додати файли :(');
    }
  }
}
