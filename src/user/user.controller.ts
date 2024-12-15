import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Controller,
  HttpException,
  // UseGuards,
  Post,
  Body,
  UsePipes,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/user/dto/user-entity.dto';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidationPipe';
import { UpdateUserSchema } from './schemas/validation.schemas';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';

@ApiBearerAuth()
@ApiTags('user')
@Roles(Role.Admin)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    description: 'User data',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  // @UsePipes(new JoiValidationPipe(UpdateUserSchema))
  async findUser(@User() user: UserEntity): Promise<UserResponseDto> {
    try {
      return await this.userService.findUserById({ _id: user._id });
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

  @Post('update')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 201,
    description: 'User updated',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UsePipes(new JoiValidationPipe(UpdateUserSchema))
  async updateUser(
    @Body() userData: UpdateUserDto,
    @User() user: UserEntity,
  ): Promise<UserResponseDto> {
    try {
      return await this.userService.updateUser(user._id, userData);
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
