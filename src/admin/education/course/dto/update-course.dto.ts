import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsNumber,
  IsDate,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

class Access {
  @ApiPropertyOptional({
    description: 'Access type',
    enum: ['PERMANENT', 'FOR_PERIOD', 'TO_DATE'],
    example: 'PERMANENT',
  })
  @IsOptional()
  @IsEnum(['PERMANENT', 'FOR_PERIOD', 'TO_DATE'])
  type?: 'PERMANENT' | 'FOR_PERIOD' | 'TO_DATE';

  @ApiPropertyOptional({
    description: 'Access start date',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dateStart?: Date;

  @ApiPropertyOptional({
    description: 'Access end date',
    example: '2025-12-31T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dateEnd?: Date;
}

class Point {
  @ApiPropertyOptional({
    description: 'Name of the point',
    example: 'Early Access',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the point',
    example: 'You will get early access to materials.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

class Contract {
  @ApiPropertyOptional({
    description: 'Date of the contract',
    example: '2025-07-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date?: Date;

  @ApiPropertyOptional({
    description: 'Sign-up deadline',
    example: '2025-06-30T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  signUpTo?: Date;

  @ApiPropertyOptional({ description: 'Optional price', example: 299.99 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @ApiPropertyOptional({
    description: 'Contract header',
    example: 'Special Summer Offer',
  })
  @IsOptional()
  @IsString()
  header?: string;

  @ApiPropertyOptional({
    description: 'List of contract points',
    type: [Point],
  })
  @IsOptional()
  @IsArray()
  points?: Point[];
}

class Literature {
  @ApiPropertyOptional({ description: 'Author', example: 'John Doe' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    description: 'Resource link',
    example: 'https://example.com/book',
  })
  @IsOptional()
  @IsUrl()
  link?: string;
}

class OptionalLink {
  @ApiProperty({
    description: 'Назва посилання',
    example: 'Документація',
  })
  name: string;

  @ApiProperty({
    description: 'URL посилання',
    example: 'https://example.com/doc',
  })
  link: string;
}

export class UpdateCourseDto {
  @ApiPropertyOptional({
    example: 'Advanced JavaScript',
    description: 'Course name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'SSK_WITH_CURATOR',
    description: 'Course type',
    enum: [
      'SSK_INDEPENDENT',
      'SSK_WITH_CURATOR',
      'SSK_WITH_SERGIY',
      'ADVANCED',
      'CONSULTING',
    ],
  })
  @IsOptional()
  @IsEnum([
    'SSK_INDEPENDENT',
    'SSK_WITH_CURATOR',
    'SSK_WITH_SERGIY',
    'ADVANCED',
    'CONSULTING',
  ])
  type?: string;

  @ApiPropertyOptional({
    example: 'ALL',
    description: 'Completeness mode',
    enum: ['ALL', 'BY_LESSON'],
  })
  @IsOptional()
  @IsEnum(['ALL', 'BY_LESSON'])
  completeness?: string;

  @ApiPropertyOptional({ description: 'Access details', type: Access })
  @IsOptional()
  access?: Access;

  @ApiPropertyOptional({ description: 'Contract details', type: Contract })
  @IsOptional()
  contract?: Contract;

  @ApiPropertyOptional({
    example: 'https://chat.example.com',
    description: 'Chat link',
  })
  @IsOptional()
  @IsUrl()
  chat?: string;

  @ApiPropertyOptional({
    example: ['https://example.com/file1.pdf'],
    description: 'Additional files',
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  additionalFiles?: string[];

  @ApiPropertyOptional({
    type: [OptionalLink],
  })
  @IsOptional()
  @IsArray()
  optionalLink?: OptionalLink[];

  @ApiPropertyOptional({
    example: ['https://example.com/file1.pdf'],
    description: 'Optional files',
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  optionalFiles?: string[];

  @ApiPropertyOptional({
    example: 'https://example.com/invoice',
    description: 'Invoice link',
  })
  @IsOptional()
  @IsUrl()
  practiceInvoice?: string;

  @ApiPropertyOptional({ example: 1, description: 'Stream number' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  stream?: number;

  @ApiPropertyOptional({ example: 199.99, description: 'Course price' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @ApiPropertyOptional({
    description: 'Recommended literature',
    type: [Literature],
  })
  @IsOptional()
  @IsArray()
  literature?: Literature[];

  @ApiPropertyOptional({
    example: 'https://example.com/cover.jpg',
    description: 'Cover image URL',
  })
  @IsOptional()
  @IsUrl()
  cover?: string;

  @ApiPropertyOptional({
    description: 'Course status',
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVE'],
    example: 'DRAFT',
  })
  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVE'])
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVE';
}
