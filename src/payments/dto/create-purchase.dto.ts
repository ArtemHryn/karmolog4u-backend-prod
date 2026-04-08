import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    example: 'prod_12345',
    description: 'ID продукту або курсу',
  })
  @IsString()
  itemId: string;

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

  @ApiPropertyOptional({
    example: 'PROMO2024',
    description: 'Промокод для знижки',
  })
  @IsOptional()
  @IsString()
  promocode?: string;
}
