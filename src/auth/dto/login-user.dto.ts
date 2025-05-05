import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    type: String,
    description: 'User email',
    example: 'wled@mail.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'User password',
    example: 'string12345',
    required: true,
  })
  password: string;
}
