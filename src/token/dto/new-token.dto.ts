import { Types } from 'mongoose';

export class NewTokenDto {
  accessToken: string;
  refreshToken: string;
  deviceId: string;
  owner: Types.ObjectId;
  expiredAt: Date;
}
