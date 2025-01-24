import { ApiProperty } from '@nestjs/swagger';

export class CreateUserByAdminDto {
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
  education?: [];

  @ApiProperty({
    type: Boolean,
    description: 'Generate password and send to email',
    example: 'false',
    required: true,
  })
  sendToEmail: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'User verified',
    example: 'false',
    required: true,
  })
  verified: boolean;
}
