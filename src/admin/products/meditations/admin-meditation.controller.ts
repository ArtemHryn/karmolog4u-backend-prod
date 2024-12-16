import {
  BadRequestException,
  NotFoundException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  // UsePipes,
  Patch,
  Put,
  UseInterceptors,
  UploadedFile,
  // ParseFilePipeBuilder,
  // HttpStatus,
  // Req,
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
// import { CreateMeditationDto } from './dto/create-meditation.dto';
import { ChangeStatusMeditationDto } from './dto/change-status-meditation.dto';
import { DiscountService } from '../discount/discount.service';
// import { EditMeditationDto } from './dto/edit-meditation.dto';
import mongoose from 'mongoose';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
// import { Public } from 'src/common/decorators/isPublic.decorator';
// import * as sharp from 'sharp';
// import * as fs from 'fs';
// import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { multerOptions } from 'src/common/helper/multerOptions';
import { fileCompress } from 'src/common/helper/fileCompress';
import { parseFields } from 'src/common/helper/parseFields';
import { fileDelete } from 'src/common/helper/fileDelete';

@ApiBearerAuth()
@ApiTags('admin-meditations')
@Roles(Role.Admin)
@Controller('admin/products/meditations')
export class AdminMeditationController {
  constructor(
    private discountService: DiscountService,
    private adminMeditationService: AdminMeditationService,
    private readonly configService: ConfigService,
  ) {}

  @Post('create')
  @ApiResponse({
    status: 201,
    description: 'Успішно',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 400, description: 'Конфлікт створення медитації' })
  @UseInterceptors(FileInterceptor('cover', multerOptions()))
  async createMeditation(
    @Body()
    data: any,
    @UploadedFile()
    file?: Express.Multer.File,
  ): Promise<any> {
    try {
      const parsedData = parseFields(data);

      // console.log(parsedData);
      // console.log(file);

      //validate data
      const { error } = newMeditationSchema.validate(parsedData);
      if (error) {
        // console.log(error);
        throw new BadRequestException(error.message);
      }

      if (file && parsedData.category !== 'ARCANES') {
        const link = await fileCompress(file, this.configService);
        parsedData.cover = link;
      } else if (file) {
        fileDelete(file.path);
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
      return { message: 'Успішно' };
    } catch (error) {
      // console.log(error);
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
  @UseInterceptors(FileInterceptor('cover', multerOptions()))
  async editMeditation(
    @Param('id') id: string,
    @Body()
    data: any,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      const parsedData = parseFields(data);
      const { error } = updateMeditationSchema.validate(parsedData);
      if (error) {
        // console.log(error);
        throw new BadRequestException(error.message);
      }

      if (file && parsedData.category !== 'ARCANES') {
        const oldMeditation =
          await this.adminMeditationService.findMeditationById(id);
        const parsedUrl = new URL(oldMeditation.cover);
        // Отримання шляху
        const filePath = parsedUrl.pathname.slice(1); // Видаляємо початковий "/"
        fileDelete(filePath);
        const link = await fileCompress(file, this.configService);
        parsedData.cover = link;
        console.log(file);
      } else if (file) {
        fileDelete(file.path);
      }

      const meditationId = new mongoose.Types.ObjectId(id.toString());
      if (parsedData.hasOwnProperty('discount')) {
        const { discount, ...meditation } = parsedData;
        const editedMeditation =
          await this.adminMeditationService.editMeditation(
            meditation,
            meditationId,
          );
        const editedDiscount = await this.discountService.editDiscount({
          ...discount,
          refId: meditationId,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...modifiedDiscount } = editedDiscount.toObject();
        return {
          ...editedMeditation,
          discount: modifiedDiscount,
        };
      } else {
        await this.discountService.deleteDiscount({
          refId: meditationId,
        });
        return await this.adminMeditationService.editMeditation(
          parsedData,
          meditationId,
        );
      }
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
