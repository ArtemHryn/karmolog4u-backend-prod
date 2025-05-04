import { ApiProperty } from '@nestjs/swagger';

export class DeleteCoursesDto {
  @ApiProperty({
    description: 'Array of course IDs to delete',
    type: [String],
    example: ['660f1c1e4f8b9b0012345678', '660f1c1e4f8b9b0098765432'],
  })
  courseIds: string[];
}
