import { ApiProperty } from '@nestjs/swagger';

export class ArrayUserIdsDto {
  @ApiProperty({
    description: 'Array of users id',
    type: [String],
    example: [
      '67883b42b89e2fc49ce7a5ab',
      '67883b42b89e2fc49ce7a5ab',
      '67883b42b89e2fc49ce7a5ab',
    ],
  })
  users: string[];
}
