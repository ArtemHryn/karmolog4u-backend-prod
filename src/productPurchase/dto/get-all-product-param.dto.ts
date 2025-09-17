import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class GetAllProductParam {
  @ApiProperty({
    description: 'Тип продукту',
    enum: ['Meditation', 'Webinar', 'GuidesAndBooks'],
    example: 'Meditation',
  })
  @IsEnum(['Meditation', 'Webinar', 'GuidesAndBooks'], {
    message: 'type має бути одним з: Meditation, Webinar, GuidesAndBooks',
  })
  type: 'Meditation' | 'Webinar' | 'GuidesAndBooks';
}
