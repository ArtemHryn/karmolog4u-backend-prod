import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetAllCoursesQueryDto {
  @ApiPropertyOptional({
    description: 'Пошук по назві курсу',
    example: 'javascript',
  })
  searchQuery?: string;

  @ApiPropertyOptional({
    description: 'Сортування за назвою курсу: 1 - ASC, -1 - DESC',
    example: 1,
    enum: [1, -1],
  })
  name?: 1 | -1;

  @ApiPropertyOptional({
    description: 'Сортування за типом курсу',
    example: -1,
    enum: [1, -1],
  })
  type?: 1 | -1;

  @ApiPropertyOptional({
    description: 'Сортування за типом доступу',
    example: 1,
    enum: [1, -1],
  })
  access?: 1 | -1;

  @ApiPropertyOptional({
    description: 'Сортування за повнотою курсу',
    example: -1,
    enum: [1, -1],
  })
  completeness?: 1 | -1;

  @ApiPropertyOptional({
    description: 'Кількість елементів на сторінці',
    example: 10,
  })
  limit?: number;

  @ApiPropertyOptional({
    description: 'Номер сторінки для пагінації',
    example: 1,
  })
  page?: number;
}
