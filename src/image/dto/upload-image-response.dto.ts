import { ApiProperty } from '@nestjs/swagger';

export class UploadImageResponseDto {
  @ApiProperty({
    description: 'URL of the uploaded image',
    example: 'https://example.com/uploads/image.jpg',
  })
  link: string;
}
