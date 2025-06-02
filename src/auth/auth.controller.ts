import { RefreshTokenResponse } from './dto/refresh-token-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  registerUserSchema,
  loginUserSchema,
  resetPasswordSchema,
} from './schemas/validation.schemas';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  Ip,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JoiValidationPipe } from 'src/common/pipes/JoiValidationPipe';
import { AuthGuard } from './auth.guard';
import { Token } from 'src/common/decorators/token.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from '../user/dto/user-entity.dto';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { TokenResponseDto } from 'src/token/dto/token-response.dto';
import { HeadersDataDto } from './dto/headers-data.dto';
import { ResponseSuccessDto } from 'src/common/dto/response-success.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UAParser } from 'ua-parser-js';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiBody({
    type: RegisterUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'register user',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 409, description: 'Email вже зареєстрований' })
  @UsePipes(new JoiValidationPipe(registerUserSchema))
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<ResponseSuccessDto> {
    try {
      await this.authService.singUp(registerUserDto);
      return { message: 'success' };
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
  @Post('login')
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'login user',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Неправильний пароль' })
  @ApiResponse({ status: 404, description: 'Email не знайдено' })
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(loginUserSchema))
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Headers('user-agent') userAgent: any,
    @Ip() ip: any,
  ): Promise<LoginResponseDto> {
    try {
      const parser = new UAParser(userAgent);
      const platform = parser.getOS().name || 'undefined';
      const headersData: HeadersDataDto = { platform, userAgent, ip };
      const login = await this.authService.singIn(loginUserDto, headersData);
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
    description: 'logout user',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 401, description: 'Неавторизований' })
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
    description: 'refresh token',
    type: RefreshTokenResponse,
  })
  @ApiResponse({ status: 401, description: 'Неавторизований' })
  @HttpCode(200)
  async refreshToken(
    @Headers('Authorization') refreshToken: string,
  ): Promise<TokenResponseDto> {
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

  @Public()
  @Post('reset-password')
  @ApiResponse({
    status: 200,
    description: 'reset password',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  @HttpCode(200)
  async resetPassword(
    @Body(new JoiValidationPipe(resetPasswordSchema)) data: ResetPasswordDto,
  ): Promise<ResponseSuccessDto> {
    try {
      return await this.authService.resetPassword(data);
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
  @Post('verify')
  @ApiResponse({
    status: 200,
    description: 'refresh token',
    type: ResponseSuccessDto,
  })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  @HttpCode(200)
  async verifyUser(@Query('token') token: string): Promise<ResponseSuccessDto> {
    try {
      return await this.authService.verifyUser(token);
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
