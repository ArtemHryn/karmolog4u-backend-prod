import {
  Controller,
  Get,
  HttpException,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/role/role.enum';
import { Roles } from 'src/role/roles.decorator';
import { CourseService } from './course.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from '../dto/user-entity.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { HasCourseGuard } from './guard/hasCourseGuard';
import { IdDto } from 'src/common/dto/id.dto';

@ApiBearerAuth()
// @UseGuards(AuthGuard)
@ApiTags('user/education')
@Roles(Role.User, Role.Admin)
@Controller('user/education')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get('/:courseId')
  @ApiOperation({ summary: 'Get course detail' })
  @ApiResponse({
    status: 200,
    description: 'Course data',
    // type: UserInfoResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Користувача не знайдено' })
  @UseGuards(HasCourseGuard)
  async getCourseDetail(@User() user: UserEntity, @Param() param: IdDto) {
    try {
      return await this.courseService.getCourseDetail(user._id, param._id);
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

  @Get('lessons-SSK/:courseId')
  @ApiOperation({ summary: 'Get lessons ssk' })
  @ApiResponse({
    status: 200,
    description: 'Lessons SSK data',
    // type: UserInfoResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Користувача не знайдено' })
  @UseGuards(HasCourseGuard)
  async getLessonsSSK(@User() user: UserEntity, @Param() param: IdDto) {
    try {
      return await this.courseService.getLessonsSSK(user._id, param._id);
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

  @Get('lessons-list/:courseId')
  @ApiOperation({ summary: 'Get lessons cons advan' })
  @ApiResponse({
    status: 200,
    description: 'Lessons Consulting & Advanced data',
    // type: UserInfoResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Користувача не знайдено' })
  @UseGuards(HasCourseGuard)
  async getLessonsList(@User() user: UserEntity, @Param() param: IdDto) {
    try {
      return;
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

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    description: 'User data',
    // type: UserInfoResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Користувача не знайдено' })
  async getLesson(@User() user: UserEntity) {
    try {
      return;
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
