import { ResponseSuccessDto } from './../user/dto/response-success.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './../token/token.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { UserEntity } from '../user/dto/user-entity.dto';
import { ConfigService } from '@nestjs/config';
import { TokenResponseDto } from 'src/token/dto/token-response.dto';
import { HeadersDataDto } from './dto/headers-data.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { generateUniquePassword } from 'src/common/helper/generatePassword';
import { VerificationService } from 'src/verification/verification.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(TokenService) private tokenService: TokenService,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(VerificationService) private verifyService: VerificationService,
    @Inject(MailService) private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async singUp(registerUserDto: RegisterUserDto) {
    try {
      const user = await this.userService.newUser(registerUserDto);
      const verifyToken = await this.jwtService.signAsync({
        _id: user._id,
        email: user.email,
      });
      await this.verifyService.createVerifyToken({
        userId: user._id,
        email: user.email,
        token: verifyToken,
      });
      if (!registerUserDto?.verified) {
        await this.mailService.sendEmail(
          user.email,
          'Verify Your Email Address',
          'verifyEmail', // HBS template name
          {
            name: user.name, // User's full name
            verifyUrl: `${this.configService.get<string>(
              'FRONT_DOMAIN',
            )}/auth/verify?token=${verifyToken}`, // Verification link
            appName: 'Karmolog4u',
            year: new Date().getFullYear(),
          },
        );
      }
      return user;
    } catch (error) {
      throw new ConflictException('Email вже зареєстрований');
    }
  }

  async singIn(
    loginUserDto: LoginUserDto,
    headersData: HeadersDataDto,
  ): Promise<LoginResponseDto> {
    try {
      const user = await this.userService.findUserByEmail({
        email: loginUserDto.email,
      });
      if (!user) {
        throw new NotFoundException('Email не знайдено');
      }
      if (!user.verified) {
        throw new ForbiddenException('Користувач не верифікований');
      }
      const decodePassword = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      if (!decodePassword) {
        throw new UnauthorizedException('Неправильний пароль');
      }
      await this.userService.updateUser(user._id, {
        lastLogin: new Date(),
      });

      const fieldsToKeep = [
        'name',
        'lastName',
        'email',
        'mobPhone',
        'role',
        'id',
      ];
      const serializedUser: Record<string, any> = {};
      fieldsToKeep.forEach((field) => {
        if (field === '_id') {
          serializedUser['id'] = user._id.toString(); // Конвертуємо ObjectId у string
        } else {
          serializedUser[field] = user[field];
        }
      });

      const accessPayload = { sub: user._id, serializedUser };
      const refreshPayload = { sub: user._id };

      const accessToken_expired = this.configService.get<string>(
        'ACCESS_TOKEN_EXPIRED',
      );
      const refreshToken_expired = this.configService.get<string>(
        'REFRESH_TOKEN_EXPIRED',
      );
      const accessToken = await this.jwtService.signAsync(accessPayload, {
        expiresIn: accessToken_expired,
      });
      const refreshToken = await this.jwtService.signAsync(refreshPayload, {
        expiresIn: refreshToken_expired,
      });
      const daysToAdd = parseInt(
        this.configService.get<string>('DOCUMENT_TOKEN_EXPIRED'),
        10,
      );
      const expiredAt = new Date(
        new Date().getTime() + daysToAdd * 24 * 60 * 60 * 1000,
      );
      const token = await this.tokenService.newToken({
        accessToken,
        refreshToken,
        ...headersData,
        owner: user._id,
        expiredAt,
      });

      return {
        user: {
          userData: serializedUser,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        },
      };
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

  async singOut(
    accessToken: string,
    user: UserEntity,
  ): Promise<ResponseSuccessDto> {
    try {
      await this.tokenService.deleteToken({
        accessToken,
        owner: user._id,
      });
      return { message: 'success' };
    } catch (error) {
      throw new UnauthorizedException('Неавторизований');
    }
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshTokenDto.token, {
        secret: 'secretcode',
      });
      const tokenInstance = await this.tokenService.findToken({
        refreshToken: refreshTokenDto.token,
        owner: payload.sub,
      });
      const user = await this.userService.findUserById({ _id: payload.sub });

      const accessPayload = {
        sub: payload.sub,
        user: user,
      };

      const accessToken_expired = this.configService.get<string>(
        'ACCESS_TOKEN_EXPIRED',
      );

      const accessToken = await this.jwtService.signAsync(accessPayload, {
        expiresIn: accessToken_expired,
      });

      const newToken = await this.tokenService.updateToken({
        accessToken,
        id: tokenInstance._id,
      });
      return newToken;
    } catch (error) {
      throw new UnauthorizedException('Неавторизований');
    }
  }

  async resetPassword(data: ResetPasswordDto): Promise<ResponseSuccessDto> {
    try {
      const user = await this.userService.findUserByEmail({
        email: data.email,
      });
      if (!user) {
        throw new NotFoundException('Користувача не знайдено');
      }
      if (!user.verified) {
        throw new ForbiddenException('Користувач не верифікований');
      }
      const newPassword = generateUniquePassword(16, {
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true,
      });
      await this.userService.updateUserPassword(user._id, newPassword);
      await this.tokenService.deleteAllSession(user._id);
      await this.mailService.sendEmail(
        user.email,
        'Password Recovery',
        'resetPassword', // HBS template name
        {
          name: user.name, // User's full name
          password: newPassword, // Newly generated password
          loginUrl: `${this.configService.get<string>(
            'FRONT_DOMAIN',
          )}/auth/login`, // Login page URL
          appName: 'Karmolog4u',
          year: new Date().getFullYear(),
        },
      );
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

  async verifyUser(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'secretcode',
      });
      const verifyToken = await this.verifyService.getVerifyToken({
        userId: payload.userId,
        email: payload.email,
      });
      if (verifyToken.token != token) {
        throw new Error();
      }
      await this.userService.updateUser(verifyToken.userId, { verified: true });
      await this.verifyService.deleteVerifyToken({ _id: verifyToken._id });
      return { message: 'success' };
    } catch (error) {
      throw new BadRequestException('Токен не відповідає дійсному');
    }
  }
}
