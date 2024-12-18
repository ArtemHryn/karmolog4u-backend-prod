import { Types } from 'mongoose';

export class UpdateTokenDto {
  // refreshToken: string;
  accessToken: string;
  id: Types.ObjectId;
}
