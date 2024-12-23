import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../schemas/guides_and_books.schema';

export class ChangeStatusGuidesAndBooksDto {
  @ApiProperty({
    enum: Status,
    enumName: 'Status', // Ім'я, яке відображатиметься у Swagger
    description: 'Status of the meditation',
    example: Status.PUBLISHED,
    required: true,
  })
  status: Status;
}
