import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: 'Name of the user',
    example: 'ZALUPA',
    required: true,
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Last name of the user',
    example: 'ZALUPA',
    required: true,
  })
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'User email',
    example: 'ZALUPA@mail.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'User mobile phone',
    example: '0967788777',
    required: true,
  })
  mobPhone: string;

  @ApiProperty({
    type: Date,
    description: 'Date when user create account',
    example: '2025-02-14T22:48:34.096+00:00',
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'User last login',
    example: '2025-02-14T22:48:34.096+00:00',
    required: true,
  })
  lastLogin: Date;

  @ApiProperty({
    type: Boolean,
    description: 'User verified',
    example: 'false',
    required: true,
  })
  verified: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'User banned',
    example: 'false',
    required: true,
  })
  banned: boolean;
}
