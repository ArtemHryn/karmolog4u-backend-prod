import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    description: 'User email',
    example: 'ZALUPA@mail.com',
    required: true,
  })
  email: string;
}
