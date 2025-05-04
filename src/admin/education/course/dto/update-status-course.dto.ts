import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusCourseDto {
  @ApiProperty({
    description: 'New status for the courses',
    example: 'PUBLISHED',
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVE'],
  })
  status: string;
}
