import {
  Controller,
  Get,
  UsePipes,
  HttpException,
  Post,
  Body,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidationPipe';
import { UpdateAdminUserSchema } from './schemas/validation.schemas';
import { UserService } from './user.service';
import { GetAlUserDto } from './dto/get-all-user.dto';
import { GetQueryDto } from './dto/get-query.dto';
import { GetUserByIdDto } from './dto/get-user-by-id.dto';
import { ResponseSuccessDto } from 'src/common/dto/response-success.dto';
import { ArrayUserIdsDto } from './dto/array-user-ids.dto';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';
import { ImportUsersDto } from './dto/import-users.dto';
import { DownloadExcelFileDto } from './dto/file-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@ApiBearerAuth()
@ApiTags('admin-user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('get/all')
  @ApiOperation({ summary: 'Get all user' })
  @ApiResponse({
    status: 200,
    description: 'Array of users',
    type: [GetAlUserDto],
  })
  @ApiResponse({ status: 404, description: 'Користувачів не знайдено' })
  async getAllUser(@Query() query: GetQueryDto): Promise<GetAlUserDto[]> {
    try {
      return await this.userService.getAllUsers(query);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          message: error.response.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @Get('get/:id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'User data',
    type: GetUserByIdDto,
  })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  async getUserById(@Param('id') id: string): Promise<GetUserByIdDto> {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          message: error.response.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete of users' })
  @ApiBody({
    type: ArrayUserIdsDto,
  })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 404, description: 'Користувачів не знайдено' })
  async deleteUsers(
    @Body() data: ArrayUserIdsDto,
  ): Promise<ResponseSuccessDto> {
    try {
      return await this.userService.deleteUsers(data);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          message: error.response.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @Post('block')
  @ApiOperation({ summary: 'Block of users' })
  @ApiBody({
    type: ArrayUserIdsDto,
  })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 400, description: 'Users not found' })
  async blockUsers(@Body() data: ArrayUserIdsDto): Promise<ResponseSuccessDto> {
    try {
      return await this.userService.blockUsers(data);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          message: error.response.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    type: CreateUserByAdminDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Create user by Admin',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 400, description: 'Щось пішло не так(' })
  async createUserByAdmin(
    @Body() data: CreateUserByAdminDto,
  ): Promise<ResponseSuccessDto> {
    try {
      return await this.userService.createUser(data);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          message: error.response.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @Post('import')
  @ApiOperation({ summary: 'Create users by import' })
  @ApiBody({
    type: ImportUsersDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Create users by Admin',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 400, description: 'Щось пішло не так(' })
  async importUsers(@Body() data: ImportUsersDto): Promise<ResponseSuccessDto> {
    try {
      return await this.userService.importUsers(data);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          message: error.response.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @Get('export/all')
  @ApiOperation({ summary: 'Export Users' })
  @ApiResponse({
    status: 200,
    description: 'Export All users by Admin',
    type: DownloadExcelFileDto,
  })
  @ApiResponse({ status: 400, description: 'Щось пішло не так(' })
  async exportAllUsers(@Res() res: Response) {
    try {
      await this.userService.exportAllUser(res);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          message: error.response.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @Get('export/:id')
  @ApiOperation({ summary: 'Export user by education id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Export users by Admin',
    type: DownloadExcelFileDto,
  })
  @ApiResponse({ status: 400, description: 'Щось пішло не так(' })
  async exportUsersByEducation(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.userService.exportUsersByEducation(id, res);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          message: error.response.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @Post('update/:id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'Update user by Admin',
    type: UpdateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Щось пішло не так(' })
  @ApiParam({ name: 'id', type: String })
  async updateUser(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(UpdateAdminUserSchema)) data: UpdateUserDto,
  ): Promise<ResponseSuccessDto> {
    try {
      return await this.userService.updateUser(id, data);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          message: error.response.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }
}
