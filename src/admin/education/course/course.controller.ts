import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';
import { ResponseSuccessDto } from 'src/common/dto/response-success.dto';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { parseFields } from 'src/common/helper/parseFields';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { GetAllCoursesQueryDto } from './dto/get-all-course-query.dto';
import { GetAllCourseResponseDto } from './dto/get-all-course-response.dto';
import { GetCourseByIdDto } from './dto/get-couse-by-id.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { DeleteCoursesDto } from './dto/delete-courses.dto';
import { UpdateStatusCourseDto } from './dto/update-status-course.dto';

@ApiBearerAuth()
@ApiTags('admin-course')
@Roles(Role.Admin)
@Controller('admin/education/course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Admin Create Course',
    description: 'Access restricted to admins',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a file with additional fields',
    type: CreateCourseDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Успішно',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 400, description: 'Конфлікт створення курсу' })
  @UseInterceptors(NoFilesInterceptor())
  async createCourse(
    @Body()
    data: CreateCourseDto,
  ) {
    try {
      const parsedData = parseFields(data);
      return await this.courseService.createCourse(parsedData);
    } catch (error) {
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
  @Get('get-all/:status')
  @ApiOperation({
    summary: 'Admin Get All Course',
    description: 'Access restricted to admins',
  })
  @ApiResponse({
    status: 200,
    description: 'get all Course',
    type: [GetAllCourseResponseDto],
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  async getAllCourse(
    @Param('status') status: string,
    @Query() query: GetAllCoursesQueryDto,
  ) {
    try {
      return await this.courseService.getAllCourse({ ...query, status });
    } catch (error) {
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

  @Get('get/:id')
  @ApiOperation({
    summary: 'Admin Get Course',
    description: 'Access restricted to admins',
  })
  @ApiResponse({
    status: 200,
    description: 'get course',
    type: GetCourseByIdDto,
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  async getCourseById(@Param('id') id: string) {
    try {
      const courseId = new mongoose.Types.ObjectId(id.toString());
      return await this.courseService.getCourseById(courseId);
    } catch (error) {
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

  @Put('edit/:id')
  @ApiOperation({
    summary: 'Admin Edit Course',
    description: 'Access restricted to admins',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a file with additional fields',
    type: UpdateCourseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'edit course',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  @UseInterceptors(NoFilesInterceptor())
  async updateCourse(@Param('id') id: string, @Body() data: UpdateCourseDto) {
    try {
      const courseId = new mongoose.Types.ObjectId(id.toString());
      const parsedData = parseFields(data);
      return await this.courseService.updateCourse({
        id: courseId,
        ...parsedData,
      });
    } catch (error) {
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

  @Delete('delete')
  @ApiOperation({
    summary: 'Admin Delete Courses',
    description: 'Access restricted to admins',
  })
  @ApiBody({
    description: 'Upload a file with additional fields',
    type: DeleteCoursesDto,
  })
  @ApiResponse({
    status: 200,
    description: 'delete course',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  async deleteCourse(@Body() data: DeleteCoursesDto) {
    try {
      const objectIds = data.courseIds.map(
        (id) => new mongoose.Types.ObjectId(id.toString()),
      );
      return await this.courseService.deleteCourse(objectIds);
    } catch (error) {
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

  @Patch('status/:id')
  @ApiOperation({
    summary: 'Admin Update Status Courses',
    description: 'Access restricted to admins',
  })
  @ApiBody({
    description: 'Upload a file with additional fields',
    type: UpdateStatusCourseDto,
  })
  @ApiResponse({
    status: 200,
    description: ' course',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  async updateStatusCourse(
    @Param('id') id: string,
    @Body() data: UpdateStatusCourseDto,
  ) {
    try {
      const courseId = new mongoose.Types.ObjectId(id.toString());
      return await this.courseService.updateStatusCourse({
        id: courseId,
        status: data.status,
      });
    } catch (error) {
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
