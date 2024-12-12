import { ResponseSuccessDto } from './../user/dto/response-success.dto';
import { RefreshTokenResponse } from './dto/refresh-token-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  registerUserSchema,
  loginUserSchema,
  refreshTokenSchema,
} from './schemas/validation.schemas';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidationPipe';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from './auth.guard';
import { Token } from 'src/common/decorators/token.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from '../user/dto/user-entity.dto';
import { Public } from 'src/common/decorators/isPublic.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'register user',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 400, description: 'Email in use' })
  @UsePipes(new JoiValidationPipe(registerUserSchema))
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<ResponseSuccessDto> {
    try {
      return await this.authService.singUp(registerUserDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: 'Email in use',
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
  }

  @Public()
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'login user',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Incorrect password' })
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(loginUserSchema))
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    try {
      const login = await this.authService.singIn(loginUserDto);
      return login;
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

  @Post('logout')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'login user',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 401, description: 'unauthorize' })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async logout(
    @Token() accessToken: string,
    @User() user: UserEntity,
  ): Promise<ResponseSuccessDto> {
    try {
      return await this.authService.singOut(accessToken, user);
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

  @Public()
  @Post('refresh-token')
  @ApiResponse({
    status: 200,
    description: 'login user',
    type: RefreshTokenResponse,
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  @HttpCode(200)
  async refreshToken(
    @Headers('Authorization') refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    try {
      const token = refreshToken.split(' ')[1];
      return await this.authService.refreshToken({ token });
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
