import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsIn, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllModuleQueryDto {
  @ApiPropertyOptional({ description: 'Пошуковий запит (назва модуля)' })
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiPropertyOptional({
    enum: [1, -1],
    description: 'Сортування за іменем: 1 - ASC, -1 - DESC',
  })
  @IsOptional()
  @IsIn([1, -1])
  @Type(() => Number)
  name?: 1 | -1;

  @ApiPropertyOptional({ type: [String], description: 'Тип модуля (масив)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  type?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Тип доступу (масив)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  access?: string[];

  @ApiPropertyOptional({
    description: 'Кількість елементів на сторінку',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Номер сторінки', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;
}
