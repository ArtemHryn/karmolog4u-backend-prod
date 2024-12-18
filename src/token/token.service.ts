import { TokenEntity } from './dto/token-entity.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { FindTokenDto } from './dto/find-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { NewTokenDto } from './dto/new-token.dto';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from './schemas/token.schema';
import { DeleteTokenDto } from './dto/delete-token.dto';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  async findToken(tokenData: FindTokenDto): Promise<TokenEntity> {
    const token = await this.tokenModel.findOne({ ...tokenData });
    if (!token) {
      throw new UnauthorizedException(); // change later
    }
    return token;
  }

  async newToken(tokenData: NewTokenDto): Promise<TokenResponseDto> {
    const token = new this.tokenModel({ ...tokenData });
    await token.save();
    if (!token) {
      throw new UnauthorizedException(); // change later
    }
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  async updateToken(tokenData: UpdateTokenDto): Promise<TokenResponseDto> {
    const token = await this.tokenModel.findByIdAndUpdate(
      tokenData.id,
      {
        $set: {
          accessToken: tokenData.accessToken,
          // refreshToken: tokenData.refreshToken,
        },
      },
      { new: true },
    );
    if (!token) {
      throw new UnauthorizedException(); // change later
    }
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }
  async deleteToken(tokenData: DeleteTokenDto): Promise<{ message: string }> {
    const token = await this.tokenModel.findOneAndDelete({
      ...tokenData,
    });
    if (!token) {
      throw new BadRequestException('Something wrong'); // change later
    }
    return { message: 'success' };
  }
}
