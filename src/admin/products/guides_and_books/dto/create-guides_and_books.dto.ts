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
  // IsUrl,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

class FileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  savedName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originalName: string;
}

export class CreateGuidesAndBooksDto {
  @ApiProperty({
    enum: CategoryGuidesAndBooks,
    enumName: 'CategoryGuidesAndBooks',
    description: 'Category of the guide',
    example: CategoryGuidesAndBooks.GUIDES,
    required: true,
  })
  @IsEnum(CategoryGuidesAndBooks, { message: 'Невалідна категорія' })
  category: CategoryGuidesAndBooks;

  @ApiPropertyOptional({
    type: Name,
    description: 'Name of the guide',
    example: { ru: 'some name', uk: 'some name' },
    required: false,
  })
  @IsOptional()
  name?: Name;

  @ApiPropertyOptional({
    type: Description,
    description: 'Description of the guide',
    example: { ru: 'some description', uk: 'some description' },
    required: false,
  })
  @IsOptional()
  description?: Description;

  @ApiPropertyOptional({
    type: String,
    example: 'some link',
    description: 'Video of the guide',
    required: false,
  })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Price of the guide',
    example: 10,
    required: false,
  })
  @IsOptional()
  // @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Waiting status of the guide',
    example: false,
    required: false,
  })
  @IsOptional()
  // @IsBoolean()
  isWaiting?: boolean;

  @ApiProperty({
    enum: Status,
    enumName: 'Status',
    description: 'Status of the guide',
    example: Status.PUBLISHED,
    required: true,
  })
  @IsEnum(Status, { message: 'Невалідний статус' })
  status: Status;

  @ApiPropertyOptional({
    type: Object,
    description: 'Discount of the guide',
    example: {
      discount: 10,
      start: '2024-12-18T19:53:24.560Z',
      expiredAt: '2024-12-18T19:53:24.560Z',
    },
    required: false,
  })
  @IsOptional()
  discount?: { discount: number; start: Date; expiredAt: Date };

  @ApiProperty({ type: FileDto })
  file: FileDto;
}
