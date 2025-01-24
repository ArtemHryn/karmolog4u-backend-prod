import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/role/role.enum';

export class GetUserByIdDto {
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
    type: Array,
    description: 'Array of user educations',
    example: '[]',
    required: true,
  })
  education: [];

  @ApiProperty({
    type: Array,
    description: 'Array of user products',
    example: '[]',
    required: true,
  })
  products: [];

  @ApiProperty({
    type: Array,
    description: 'Array of user payments',
    example: '[]',
    required: true,
  })
  payment: [];

  @ApiProperty({
    type: Boolean,
    description: 'Status is user banned',
    example: 'false',
    required: true,
  })
  banned: boolean;

  @ApiProperty({
    type: String,
    description: 'User role',
    example: 'USER',
    required: true,
  })
  role: Role[];

  @ApiProperty({
    type: Boolean,
    description: 'Status is user verified',
    example: 'true',
    required: true,
  })
  verified: boolean;

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
}
