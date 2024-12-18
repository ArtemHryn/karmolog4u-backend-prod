import { ResponseSuccessDto } from './../user/dto/response-success.dto';
import { RefreshTokenResponse } from './dto/refresh-token-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './../token/token.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { UserEntity } from '../user/dto/user-entity.dto';
import { ConfigService } from '@nestjs/config';
import { TokenResponseDto } from 'src/token/dto/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(TokenService) private tokenService: TokenService,
    @Inject(JwtService) private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async singUp(registerUserDto: RegisterUserDto): Promise<ResponseSuccessDto> {
    const user = await this.userService.newUser(registerUserDto);
    return user;
  }

  async singIn(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.userService.findUserByEmail({
      email: loginUserDto.email,
    });
    const decodePassword = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!decodePassword) {
      throw new BadRequestException('Incorrect password');
    }
    const deviceId = uuidv4();
    const {
      fullName,
      email,
      banned,
      role,
      mobPhone,
      _id,
      toDelete,
      createdAt,
      updatedAt,
      // expiredAt,
    } = user;
    const userData = {
      _id,
      fullName,
      email,
      banned,
      role,
      mobPhone,
      toDelete,
      createdAt,
      updatedAt,
      // expiredAt,
    };
    const accessPayload = { sub: user._id, user: userData, deviceId };
    const refreshPayload = { sub: user._id, deviceId };

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
      deviceId,
      owner: user._id,
      expiredAt,
    });

    return {
      user: {
        userData: user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      },
    };
  }

  async singOut(
    accessToken: string,
    user: UserEntity,
  ): Promise<ResponseSuccessDto> {
    await this.tokenService.deleteToken({
      accessToken,
      owner: user._id,
    });
    return { message: 'success' };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenResponseDto> {
    const payload = await this.jwtService.verifyAsync(refreshTokenDto.token, {
      secret: 'secretcode',
    });

    console.log('1');

    const tokenInstance = await this.tokenService.findToken({
      refreshToken: refreshTokenDto.token,
      deviceId: payload.deviceId,
      owner: payload.sub,
    });
    console.log('2');

    // if (!tokenInstance) {
    //   throw new Error();

    //   // throw new BadRequestException('Something wrong');
    // }
    const user = await this.userService.findUserById({ _id: payload.sub });
    // if (!user) {
    //   throw new Error();

    //   // throw new BadRequestException('Something wrong with user');
    // }
    console.log('3');

    const accessPayload = {
      sub: payload.sub,
      user: user,
      deviceId: tokenInstance.deviceId,
    };
    // const refreshPayload = {
    //   sub: payload.sub,
    //   deviceId: tokenInstance.deviceId,
    // };

    const accessToken_expired = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRED',
    );
    // const refreshToken_expired = this.configService.get<string>(
    //   'REFRESH_TOKEN_EXPIRED',
    // );

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      expiresIn: accessToken_expired,
    });
    // const refreshToken = await this.jwtService.signAsync(refreshPayload, {
    //   expiresIn: refreshToken_expired,
    // });

    const newToken = await this.tokenService.updateToken({
      // refreshToken: tokenInstance.refreshToken,
      accessToken,
      id: tokenInstance._id,
    });
    return newToken;
  }
}
