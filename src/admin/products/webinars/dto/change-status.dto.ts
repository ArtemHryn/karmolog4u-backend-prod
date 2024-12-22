import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../schemas/webinars.schema';

export class ChangeStatusWebinarDto {
  @ApiProperty({
    enum: Status,
    enumName: 'Status', // Ім'я, яке відображатиметься у Swagger
    description: 'Status of the meditation',
    example: Status.PUBLISHED,
    required: true,
  })
  status: Status;
}
