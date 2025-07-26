import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsDate,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: String,
    description: "Ім'я користувача",
    example: 'Іван',
  })
  @IsOptional()
  @IsString({ message: "Ім'я повинно бути текстовим значенням" })
  name?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Прізвище користувача',
    example: 'Петренко',
  })
  @IsOptional()
  @IsString({ message: 'Прізвище повинно бути текстовим значенням' })
  lastName?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Email користувача',
    example: 'ivan.petrenko@gmail.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Некоректний формат email' })
  email?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Номер телефону користувача у форматі +380...',
    example: '+380967788777',
  })
  @IsOptional()
  @IsPhoneNumber(null, { message: 'Некоректний формат номера телефону' })
  mobPhone?: string;

  @ApiPropertyOptional({
    type: Date,
    description: 'Дата створення акаунту',
    example: '2025-02-14T22:48:34.096Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'createdAt повинен бути датою' })
  createdAt?: Date;

  @ApiPropertyOptional({
    type: Date,
    description: 'Дата останнього входу користувача',
    example: '2025-07-20T16:58:30.472Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'lastLogin повинен бути датою' })
  lastLogin?: Date;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Чи підтверджено користувача',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'verified повинен бути булевим значенням' })
  verified?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Чи заблоковано користувача',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'banned повинен бути булевим значенням' })
  banned?: boolean;
}
