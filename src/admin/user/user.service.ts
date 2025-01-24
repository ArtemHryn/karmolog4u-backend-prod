import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { GetQueryDto } from './dto/get-query.dto';
import { GetAlUserDto } from './dto/get-all-user.dto';
import { GetUserByIdDto } from './dto/get-user-by-id.dto';
import { ArrayUserIdsDto } from './dto/array-user-ids.dto';
import { ResponseSuccessDto } from 'src/common/dto/response-success.dto';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';
import { ImportUsersDto } from './dto/import-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateUniquePassword } from 'src/common/helper/generatePassword';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(AuthService) private authService: AuthService,
    @Inject(MailService) private mailService: MailService,
    private configService: ConfigService,
  ) {}
  async getAllUsers(query: GetQueryDto): Promise<GetAlUserDto[]> {
    try {
      const skip = (query.page - 1) * query.limit;
      return await this.userModel
        .aggregate([
          {
            $addFields: {
              education: [{ id: 1, name: 'Name of education' }],
            },
          },
          {
            $project: {
              name: 1,
              lastName: 1,
              email: 1,
              mobPhone: 1,
              education: 1,
              createdAt: 1,
              lastLogin: 1,
              verified: 1,
              banned: 1,
            },
          },
          ...(query.searchQuery?.trim()
            ? [
                {
                  $match: {
                    $or: [
                      { name: { $regex: query.searchQuery, $options: 'i' } },
                      { email: { $regex: query.searchQuery, $options: 'i' } },
                    ],
                  },
                },
              ]
            : []),
          ...(query.sortField
            ? [
                {
                  $sort: {
                    [query.sortField]:
                      query.sortOrder === 'asc'
                        ? (1 as 1 | -1)
                        : (-1 as 1 | -1),
                  },
                },
              ]
            : []),
          {
            $facet: {
              paginatedData: [{ $skip: skip }, { $limit: query.limit }],
              totalCount: [{ $count: 'count' }],
            },
          },
          {
            $project: {
              data: '$paginatedData',
              totalPromo: {
                $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0],
              },
            },
          },
        ])
        .exec();
    } catch (error) {
      throw new NotFoundException('Користувачів не знайдено');
    }
  }

  async getUserById(id: string): Promise<GetUserByIdDto> {
    try {
      const userId = new mongoose.Types.ObjectId(id.toString());
      const user = await this.userModel
        .aggregate([
          {
            $match: { _id: userId }, // Знаходимо промокод за _id
          },
          {
            $addFields: {
              education: [{ id: 1, name: 'Name of education' }],
              payment: [{ id: 1, name: 'Payment 1' }],
              products: [{ id: 1, name: 'Product 1' }],
            },
          },
          {
            $project: {
              name: 1,
              lastName: 1,
              email: 1,
              role: 1,
              mobPhone: 1,
              createdAt: 1,
              lastLogin: 1,
              verified: 1,
              banned: 1,
              education: 1,
              payment: 1,
              products: 1,
            },
          },
        ])
        .exec();
      if (!user[0]) {
        throw new Error();
      }
      return user[0];
    } catch (error) {
      throw new NotFoundException('Користувача не знайдено');
    }
  }

  async deleteUsers(data: ArrayUserIdsDto): Promise<ResponseSuccessDto> {
    try {
      const objectIds = data.users.map((id) => new mongoose.Types.ObjectId(id));
      await this.userModel.deleteMany({ _id: { $in: objectIds } });
      //delete all data related to users
      return { message: 'success' };
    } catch (error) {
      throw new NotFoundException('Користувачів не знайдено');
    }
  }

  async blockUsers(data: ArrayUserIdsDto): Promise<ResponseSuccessDto> {
    try {
      const objectIds = data.users.map((id) => new mongoose.Types.ObjectId(id));
      await this.userModel.updateMany({ _id: { $in: objectIds } }, [
        {
          $set: {
            banned: { $not: '$banned' }, // Invert the boolean value of 'banned'
          },
        },
      ]);
      return { message: 'success' };
    } catch (error) {
      throw new NotFoundException('Користувачів не знайдено');
    }
  }

  async createUser(data: CreateUserByAdminDto): Promise<ResponseSuccessDto> {
    try {
      const { education, sendToEmail, ...userData } = data;
      const newPassword = generateUniquePassword(16, {
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true,
      });
      const user = await this.authService.singUp({
        ...userData,
        password: newPassword,
      });
      if (sendToEmail) {
        await this.mailService.sendEmail(
          user.email,
          'Password Recovery',
          'resetPassword', // HBS template name
          {
            name: user.name, // User's full name
            //todo add email
            password: newPassword, // Newly generated password
            loginUrl: `${this.configService.get<string>(
              'FRONT_DOMAIN',
            )}/auth/login`, // Login page URL
            appName: 'Karmolog4u',
            year: new Date().getFullYear(),
          },
        );
      }
      if (education.length >= 1) {
        //todo add education
      }
      return { message: 'success' };
    } catch (error) {
      throw new BadRequestException('Щось пішло не так(');
    }
  }

  async importUsers(data: ImportUsersDto): Promise<ResponseSuccessDto> {
    try {
      const users = data.users.map((user) => ({
        ...user, // Spread the existing user object
        password: generateUniquePassword(16, {
          includeUppercase: true,
          includeNumbers: true,
          includeSymbols: true,
        }),
        verified: data.verified ? true : false, // Add 'verified' property based on data.verified
      }));
      await this.userModel.insertMany(users);
      if (data.sendToEmail) {
        const emailPromises = users.map(async (user) => {
          return await this.mailService.sendEmail(
            user.email,
            'Password Recovery',
            'resetPassword', // HBS template name
            {
              name: user.name, // User's full name
              //todo add email
              password: user.password, // Newly generated password
              loginUrl: `${this.configService.get<string>(
                'FRONT_DOMAIN',
              )}/auth/login`, // Login page URL
              appName: 'Karmolog4u',
              year: new Date().getFullYear(),
            },
          );
        });

        // Wait for all email sending promises to resolve
        await Promise.all(emailPromises);
      }
      return { message: 'success' };
    } catch (error) {
      throw new BadRequestException('Щось пішло не так(');
    }
  }

  async exportAllUser(res: Response) {
    try {
      const users = await this.userModel.find({
        password: 0,
        toDelete: 0,
        expiredAt: 0,
      });
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users');

      worksheet.columns = [
        { header: 'ID', key: '_id', width: 10 },
        { header: 'Імя', key: 'name', width: 30 },
        { header: 'Прізвище', key: 'lastName', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Моб. тел.', key: 'mobPhone', width: 30 },
        { header: 'Верифікований', key: 'verified', width: 30 },
        { header: 'Заблокований', key: 'banned', width: 30 },
        { header: 'Роль', key: 'role', width: 15 },
        { header: 'Останній вхід', key: 'lastLogin', width: 15 },
        { header: 'Навчання', key: 'education', width: 15 },
      ];
      users.forEach((user) => {
        worksheet.addRow(user);
      });
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      throw new BadRequestException('Щось пішло не так(');
    }
  }

  async exportUsersByEducation(id: string, res: Response) {
    try {
      //todo find users in education
      const users = await this.userModel.find({
        password: 0,
        toDelete: 0,
        expiredAt: 0,
      });
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users');

      worksheet.columns = [
        { header: 'ID', key: '_id', width: 10 },
        { header: 'Імя', key: 'name', width: 30 },
        { header: 'Прізвище', key: 'lastName', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Моб. тел.', key: 'mobPhone', width: 30 },
        { header: 'Верифікований', key: 'verified', width: 30 },
        { header: 'Заблокований', key: 'banned', width: 30 },
        { header: 'Роль', key: 'role', width: 15 },
        { header: 'Останній вхід', key: 'lastLogin', width: 15 },
        { header: 'Навчання', key: 'education', width: 15 },
      ];
      users.forEach((user) => {
        worksheet.addRow(user);
      });
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      throw new BadRequestException('Щось пішло не так(');
    }
  }

  async updateUser(
    id: string,
    data: UpdateUserDto,
  ): Promise<ResponseSuccessDto> {
    try {
      const _id = new mongoose.Types.ObjectId(id);
      return await this.userModel.findByIdAndUpdate(
        _id,
        {
          $set: data,
        },
        { new: true, projection: { _id: 0 } },
      );
    } catch (error) {
      throw new BadRequestException('Щось пішло не так(');
    }
  }
}
