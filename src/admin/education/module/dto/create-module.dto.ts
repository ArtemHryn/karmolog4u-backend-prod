import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AccessDto {
  @ApiProperty({
    example: '2025-06-01T00:00:00.000Z',
    description: 'Дата початку доступу',
  })
  @IsDateString()
  @IsNotEmpty()
  dateStart: Date;

  @ApiProperty({
    example: '2025-07-01T00:00:00.000Z',
    description: 'Дата завершення доступу',
  })
  @IsDateString()
  @IsNotEmpty()
  dateEnd: Date;
}

export class CreateModuleDto {
  @ApiProperty({ example: 'Basic Grammar', description: 'Назва модуля' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'grammar', description: 'Тип модуля' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ type: AccessDto, description: 'Період доступу до модуля' })
  @ValidateNested()
  @Type(() => AccessDto)
  access: AccessDto;

  @ApiProperty({ example: '30', description: 'Тривалість у днях' })
  @IsString()
  @IsNotEmpty()
  durationInDays: string;

  @ApiProperty({ example: '60af8840b6e3b12c4c8d9f3a', description: 'ID курсу' })
  @IsMongoId()
  @IsNotEmpty()
  course: string;
}
