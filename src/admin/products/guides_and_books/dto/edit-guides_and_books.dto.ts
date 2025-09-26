import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CategoryGuidesAndBooks,
  Description,
  Name,
  Status,
} from '../schemas/guides_and_books.schema';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsObject,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class FileDto {
  @ApiProperty({ description: 'Saved file name on server' })
  @IsString({ message: 'savedName must be a string' })
  savedName: string;

  @ApiProperty({ description: 'Original uploaded file name' })
  @IsString({ message: 'originalName must be a string' })
  originalName: string;
}

class DiscountDto {
  @ApiProperty({ example: 10 })
  @IsNumber({}, { message: 'discount must be a number' })
  discount: number;

  @ApiProperty({ example: '2024-12-18T19:53:24.560Z' })
  @IsDateString({}, { message: 'start must be a valid date string' })
  start: Date;

  @ApiProperty({ example: '2025-02-18T19:53:24.560Z' })
  @IsDateString({}, { message: 'expiredAt must be a valid date string' })
  expiredAt: Date;
}

export class EditGuidesAndBooksDto {
  @ApiProperty({
    enum: CategoryGuidesAndBooks,
    enumName: 'CategoryGuidesAndBooks',
    description: 'Category of the guide/book',
    example: CategoryGuidesAndBooks.GUIDES,
  })
  @IsEnum(CategoryGuidesAndBooks, {
    message: `category must be one of: ${Object.values(
      CategoryGuidesAndBooks,
    ).join(', ')}`,
  })
  category: CategoryGuidesAndBooks;

  @ApiPropertyOptional({
    type: Object,
    description: 'Name of the guide/book',
    example: { ru: 'Название', uk: 'Назва' },
    required: false,
  })
  @IsOptional()
  // @IsObject({ message: 'name must be an object' })
  name?: Name;

  @ApiPropertyOptional({
    type: Object,
    description: 'Description of the guide/book',
    example: { ru: 'Описание', uk: 'Опис' },
    required: false,
  })
  @IsOptional()
  // @IsObject({ message: 'description must be an object' })
  description?: Description;

  @ApiPropertyOptional({
    type: String,
    example: 'https://youtube.com/somevideo',
    description: 'Video link',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'video must be a string' })
  video?: string;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
    description: 'Price of the guide/book',
    required: false,
  })
  @IsOptional()
  // @IsNumber({}, { message: 'price must be a number' })
  price?: number;

  @ApiPropertyOptional({
    type: Boolean,
    example: false,
    description: 'Is the guide/book waiting',
    required: false,
  })
  @IsOptional()
  // @IsBoolean({ message: 'isWaiting must be a boolean' })
  isWaiting?: boolean;

  @ApiProperty({
    enum: Status,
    enumName: 'Status',
    description: 'Publication status',
    example: Status.PUBLISHED,
  })
  @IsEnum(Status, {
    message: `status must be one of: ${Object.values(Status).join(', ')}`,
  })
  status: Status;

  @ApiPropertyOptional({ type: DiscountDto })
  @IsOptional()
  // @ValidateNested()
  // @Type(() => DiscountDto)
  discount?: DiscountDto;

  @ApiProperty({
    type: String,
    format: 'url',
    description: 'Cover image URL',
    required: false,
    example: 'https://example.com/cover.jpg',
  })
  @IsOptional()
  @IsString({ message: 'cover must be a string (URL)' })
  cover?: string;

  @ApiPropertyOptional({ type: FileDto })
  @IsOptional()
  // @ValidateNested()
  // @Type(() => FileDto)
  file?: FileDto;
}
