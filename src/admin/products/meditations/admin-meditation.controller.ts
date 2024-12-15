import { MeditationDocument } from './../../../products/meditations/schemas/meditation.schema';
import {
  BadRequestException,
  NotFoundException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  Patch,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidationPipe';
import { MeditationEntity } from 'src/products/meditations/dto/meditation-entity.dto';
import {
  changeStatusMeditationSchema,
  newMeditationSchema,
  updateMeditationSchema,
} from 'src/admin/products/meditations/schemas/validation.schema';
import { ResponseSuccessDto } from 'src/user/dto/response-success.dto';
import { AdminMeditationService } from './admin-meditation.service';
import { CreateMeditationDto } from './dto/create-meditation.dto';
import { ChangeStatusMeditationDto } from './dto/change-status-meditation.dto';
import { DiscountService } from '../discount/discount.service';
import { EditMeditationDto } from './dto/edit-meditation.dto';
import mongoose from 'mongoose';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Public } from 'src/common/decorators/isPublic.decorator';
import * as multer from 'multer';
// import { uuid } from 'uuidv4';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
// import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@ApiBearerAuth()
@ApiTags('admin-meditations')
// @Roles(Role.Admin)
@Controller('admin/products/meditations')
export class AdminMeditationController {
  constructor(
    private discountService: DiscountService,
    private adminMeditationService: AdminMeditationService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('create')
  @ApiResponse({
    status: 201,
    description: 'Успішно',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 400, description: 'Конфлікт створення медитації' })
  @UseInterceptors(FileInterceptor('cover', multerOptions))
  async createMeditation(
    @Body()
    data: any,
    @UploadedFile()
    file?: Express.Multer.File,
  ): Promise<any> {
    try {
      const parsedData = parseFields(data);
      // let parsedData: any;
      console.log(parsedData);
      console.log(file);

      // const parsedDiscount = data.discount
      //   ? JSON.parse(data.discount)
      //   : undefined;

      // if (parsedDiscount) {
      //   parsedData = {
      //     ...data,
      //     name: JSON.parse(data.name),
      //     description: JSON.parse(data.description),
      //     isWaiting: JSON.parse(data.isWaiting),
      //     discount: JSON.parse(data.discount),
      //   };
      // } else {
      //   parsedData = {
      //     ...data,
      //     name: JSON.parse(data.name),
      //     description: JSON.parse(data.description),
      //     isWaiting: JSON.parse(data.isWaiting),
      //   };
      // }

      //validate data
      const { error } = newMeditationSchema.validate(parsedData);
      if (error) {
        // console.log(error);
        throw new BadRequestException(error.message);
      }

      if (parsedData.category == 'ARCANES') {
        if (parsedData.hasOwnProperty('discount')) {
          const { discount, ...meditation } = parsedData;
          const newMeditation =
            await this.adminMeditationService.createMeditation(meditation);
          const discountData = {
            ...discount,
            refId: newMeditation._id,
          };
          await this.discountService.createDiscount(discountData);
          return { message: 'Успішно' };
        } else {
          await this.adminMeditationService.createMeditation(parsedData);
        }
        console.log('arcane');

        return { message: 'Успішно' };
      } else {
        if (file) {
          const link = await fileCompress(file, this.configService);
          parsedData.cover = link;
        }

        if (parsedData.hasOwnProperty('discount')) {
          const { discount, ...meditation } = parsedData;
          const newMeditation =
            await this.adminMeditationService.createMeditation(meditation);

          const discountData = {
            ...discount,
            refId: newMeditation._id,
          };
          await this.discountService.createDiscount(discountData);
          return { message: 'Успішно' };
        } else {
          await this.adminMeditationService.createMeditation(parsedData);
        }
        console.log('else');

        return { message: 'Успішно' };
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Конфлікт створення медитації');
    }
  }

  @Get('get/:id')
  @ApiResponse({
    status: 200,
    description: 'get-meditation-by-id',
    type: MeditationEntity,
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  async getMeditationById(
    @Param('id') meditationId: string,
  ): Promise<MeditationEntity> {
    try {
      return await this.adminMeditationService.findMeditationById(meditationId);
    } catch (error) {
      throw new NotFoundException('Медитацію не знайдено');
    }
  }

  @Get('get-all')
  @ApiResponse({
    status: 200,
    description: 'get-all-meditation',
    type: [MeditationEntity],
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  async getAllMeditation(): Promise<MeditationEntity[]> {
    try {
      return await this.adminMeditationService.findAllMeditation();
    } catch (error) {
      throw new NotFoundException('Медитації не знайдено');
    }
  }

  @Put('edit/:id')
  @ApiResponse({
    status: 200,
    description: 'update-meditation',
    type: MeditationEntity,
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  @UseInterceptors(FileInterceptor('cover', multerOptions))
  async editMeditation(
    @Param('id') id: string,
    @Body()
    data: any,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      if (!file) {
      } else {
      }
      // const meditationId = new mongoose.Types.ObjectId(id.toString());
      // if (meditationData.hasOwnProperty('discount')) {
      //   const { discount, ...meditation } = meditationData;
      //   const editedMeditation =
      //     await this.adminMeditationService.editMeditation(
      //       meditation,
      //       meditationId,
      //     );
      //   const editedDiscount = await this.discountService.editDiscount({
      //     ...discount,
      //     refId: meditationId,
      //   });
      //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
      //   const { _id, ...modifiedDiscount } = editedDiscount.toObject();
      //   return {
      //     ...editedMeditation,
      //     discount: modifiedDiscount,
      //   };
      // } else {
      //   await this.discountService.deleteDiscount({
      //     refId: meditationId,
      //   });
      //   return await this.adminMeditationService.editMeditation(
      //     meditationData,
      //     meditationId,
      //   );
      // }
    } catch (error) {
      throw new BadRequestException('Конфлікт редагування медитації');
    }
  }

  @Patch('delete/:id')
  @ApiResponse({
    status: 200,
    description: 'delete-meditation',
    type: MeditationEntity,
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  async deleteMeditation(
    @Param('id') meditationId: string,
  ): Promise<ResponseSuccessDto> {
    try {
      return await this.adminMeditationService.deleteMeditation(meditationId);
    } catch (error) {
      throw new BadRequestException('Конфлікт видалення медитації');
    }
  }

  @Patch('status/:id')
  @ApiResponse({
    status: 200,
    description: 'change - status -meditation',
    type: ChangeStatusMeditationDto,
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  async changeStatusMeditation(
    @Param('id') meditationId: string,
    @Body(new JoiValidationPipe(changeStatusMeditationSchema))
    status: ChangeStatusMeditationDto,
  ): Promise<ResponseSuccessDto> {
    try {
      return await this.adminMeditationService.changeStatusMeditation(
        meditationId,
        status,
      );
    } catch (error) {
      throw new BadRequestException('Конфлікт змінення статусу медитації');
    }
  }
}
export const multerOptions: MulterOptions = {
  storage: multer.diskStorage({
    destination: './temporary', // Директорія для збереження файлів
    filename: (req, file, callback) => {
      // Зміна імені файлу
      console.log(file, 'file');

      const [, ext] = file.originalname.split('.');
      const filename = `${Date.now()}_${uuidv4()}.${ext}`;
      callback(null, `${filename}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    // Перевірка MIME-типу
    if (file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      callback(null, true); // Приймаємо тільки зображення
    } else {
      callback(new Error('Only image files are allowed!'), false); // Відхиляємо файли
    }
  },
};

export const fileCompress = async (file: any, configService: ConfigService) => {
  const [name, extention] = file.filename.split('.');
  const compressedPath = path.join('./covers', `${name}.webp`);
  fs.mkdirSync(path.dirname(compressedPath), { recursive: true });

  // Стиснення зображення
  await sharp(file.path)
    .resize(800) // Змінює ширину до 800 пікселів, зберігаючи співвідношення сторін
    .webp({ quality: 75 }) // Конвертує в JPEG з якістю 70%
    .toFile(compressedPath); // Зберігає файл

  //delete temporary image
  fs.unlink(file.path, (err) => {
    if (err) {
      console.error(`Помилка при видаленні файлу: ${err.message}`);
      new Error(err.message);
    } else {
      console.log('Файл успішно видалено');
    }
  });
  //crate link for image
  const envValue = configService.get<string>('SERVER_IP');
  return `${envValue}${compressedPath}`;
};

function parseFields(data: any): Record<string, any> {
  if (typeof data !== 'object' || data === null) {
    throw new TypeError('Expected an object for parsing fields.');
  }

  const parsedData: Record<string, any> = {};

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      try {
        parsedData[key] = JSON.parse(data[key]);
      } catch (error) {
        parsedData[key] = data[key]; // Якщо поле не JSON, залишаємо як є
      }
    }
  }

  return parsedData;
}
