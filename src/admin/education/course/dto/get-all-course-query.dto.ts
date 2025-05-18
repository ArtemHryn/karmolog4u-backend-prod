import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

// Define an enum for course types
enum AccessType {
  PERMANENT = 'PERMANENT',
  FOR_PERIOD = 'FOR_PERIOD',
  TO_DATE = 'TO_DATE',
}
enum CourseType {
  SSK_INDEPENDENT = 'SSK_INDEPENDENT',
  SSK_WITH_CURATOR = 'SSK_WITH_CURATOR',
  SSK_WITH_SERGIY = 'SSK_WITH_SERGIY',
  ADVANCED = 'ADVANCED',
  CONSULTING = 'CONSULTING',
}

enum CompletenessType {
  ALL = 'ALL',
  BY_LESSON = 'BY_LESSON',
}

export class GetAllCoursesQueryDto {
  @ApiPropertyOptional({
    description: 'Пошук по назві курсу',
    example: 'javascript',
  })
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiPropertyOptional({
    description: 'Сортування за назвою курсу: 1 - ASC, -1 - DESC',
    example: 1,
    enum: [1, -1],
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value)) // Converts string to number
  @IsInt()
  @Min(-1)
  @Max(1)
  name?: 1 | -1;

  @ApiPropertyOptional({
    description: 'Сортування за типом курсу',
    example: [CourseType.ADVANCED, CourseType.CONSULTING], // Array Example
    enum: CourseType,
    isArray: true, // Mark as array in Swagger docs
  })
  @Transform(({ value }) => {
    if (!value) return [];
    if (typeof value === 'string') return [value]; // Force single values into an array
    if (Array.isArray(value)) return value; // Keep arrays unchanged
    return [];
  })
  @IsOptional()
  @IsArray()
  @IsEnum(CourseType, { each: true })
  type?: CourseType[];

  @ApiPropertyOptional({
    description: 'Сортування за типом доступу',
    example: AccessType.PERMANENT,
    enum: AccessType,
  })
  @IsOptional()
  @IsEnum(AccessType) // Ensures value is valid enum type
  access?: AccessType;

  @ApiPropertyOptional({
    description: 'Сортування за повнотою курсу',
    example: CompletenessType.ALL,
    enum: CompletenessType,
  })
  @IsOptional()
  @IsEnum(CompletenessType) // Ensures only valid enum values
  completeness?: CompletenessType;

  @ApiPropertyOptional({
    description: 'Кількість елементів на сторінці',
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value)) // Converts string to number
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Номер сторінки для пагінації',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value)) // Converts string to number
  @IsInt()
  @Min(1)
  page?: number;
}
