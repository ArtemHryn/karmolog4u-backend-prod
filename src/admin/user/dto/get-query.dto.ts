import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetQueryDto {
  @ApiPropertyOptional({ description: 'Search term', type: String })
  searchQuery?: string;
  //name , email

  @ApiPropertyOptional({ description: 'pages ', type: String })
  page?: number;

  @ApiPropertyOptional({
    description: 'Limit the number of results ',
    type: String,
  })
  limit?: number;

  @ApiPropertyOptional({
    description: 'filter by education ',
    type: String,
  })
  filter?: string;

  @ApiPropertyOptional({
    description:
      'sort by name, email, date of registration, date of activity, banned, verified',
    type: String,
  })
  sortField?: string;

  @ApiPropertyOptional({
    description:
      'sort by name, email, date of registration, date of activity, banned, verified',
    type: String,
  })
  sortOrder?: string;
}
