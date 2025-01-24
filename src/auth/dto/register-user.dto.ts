import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
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
    description: 'User mobile number',
    example: '0967788777',
    required: true,
  })
  mobPhone: string;

  @ApiProperty({
    type: String,
    description: 'User email',
    example: 'ZALUPA@mail.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'User password',
    example: 'ZALUPA12345',
    required: true,
  })
  password: string;

  verified?: boolean;
}
