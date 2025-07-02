import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateStatusLessonDto {
  @ApiProperty({
    description: 'New status for the lesson',
    example: 'PUBLISHED',
    enum: ['DRAFT', 'PUBLISHED'],
  })
  @IsEnum(['DRAFT', 'PUBLISHED'])
  status: 'DRAFT' | 'PUBLISHED';
}
