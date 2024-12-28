import { ApiProperty } from '@nestjs/swagger';

export class RestoreDto {
  @ApiProperty({
    type: String,
    description: 'Id of the product',
    example: '6744d2c8bd8f6d722ff28c49',
    required: true,
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'collection of the product',
    example: 'webinars',
    required: true,
  })
  collection: string;
}
