import { ApiProperty } from '@nestjs/swagger';

class NameDto {
  @ApiProperty({
    example: 'some name',
    description: "Назва об'єкта українською мовою",
  })
  uk: string;
}

class DataItemDto {
  @ApiProperty({
    example: '67692a26ce89262da9ef0b45',
    description: "Унікальний ідентифікатор об'єкта",
  })
  _id: string;

  @ApiProperty({ example: 'ARCANES', description: "Категорія об'єкта" })
  category: string;

  @ApiProperty({ type: NameDto, description: "Назва об'єкта" })
  name: NameDto;

  @ApiProperty({
    example: '2025-01-22T11:15:53.479Z',
    description:
      'Дата закінчення терміну дії. Може бути null, якщо термін не обмежений',
    nullable: true,
  })
  expiredAt: string | null;

  @ApiProperty({
    example: 'Медитації',
    description: "Розділ, до якого належить об'єкт",
  })
  section: string;

  @ApiProperty({
    example: 'meditation',
    description: "Колекція, до якої належить об'єкт",
  })
  collection: string;
}

export class GetAllResponseDto {
  @ApiProperty({ type: [DataItemDto], description: 'Список даних' })
  data: DataItemDto[];

  @ApiProperty({ example: 4, description: "Загальна кількість об'єктів" })
  total: number;

  @ApiProperty({ example: 1, description: 'Номер поточної сторінки' })
  page: number;

  @ApiProperty({ example: 10, description: "Ліміт об'єктів на сторінці" })
  limit: number;
}
