import { IsIn, IsOptional, IsString, IsInt, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersQueryDto {
  @ApiPropertyOptional({
    description: 'Поле для сортування',
    enum: ['name', 'email', 'register_date', 'active', 'blocked', 'verified'],
    example: 'email',
  })
  @IsOptional()
  @IsIn(['name', 'email', 'register_date', 'active', 'blocked', 'verified'], {
    message:
      'sortBy може бути лише одним із: name, email, register_date, active, blocked, verified',
  })
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Порядок сортування: 1 — за зростанням, -1 — за спаданням',
    enum: [1, -1],
    example: -1,
  })
  @IsOptional()
  @IsIn([1, -1], {
    message: 'sortOrder може бути лише 1 (ASC) або -1 (DESC)',
  })
  @Type(() => Number)
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Пошук по імені, прізвищу або email',
    example: 'ivan',
  })
  @IsOptional()
  @IsString({
    message: 'search має бути рядком',
  })
  searchQuery?: string;

  @ApiPropertyOptional({
    description: 'ID курсу для фільтрації',
    example: '64a872bd92c1d5412830c9a1',
  })
  @IsOptional()
  @IsMongoId({
    message: 'course_id має бути дійсним MongoID',
  })
  course_id?: string;

  @ApiPropertyOptional({
    description: 'Номер сторінки (pagination)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'page має бути цілим числом',
  })
  page?: number;

  @ApiPropertyOptional({
    description: 'Кількість елементів на сторінку (pagination)',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'limit має бути цілим числом',
  })
  limit?: number;
}
