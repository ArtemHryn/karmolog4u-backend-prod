import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  Min,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({
    example: 'prod_12345',
    description: 'ID продукту або курсу',
  })
  @IsString()
  itemId: string;

  @ApiProperty({
    example: 499.99,
    description: 'Сума платежу',
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({
    example: 'b3f7c2b2-6c1a-4d9b-9b2a-123456789abc',
    description: 'ID користувача (якщо авторизований)',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Email клієнта (обовʼязковий)',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '+380671234567',
    description: 'Телефон клієнта',
  })
  @IsOptional()
  @IsPhoneNumber('UA')
  phone?: string;
}
