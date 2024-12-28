import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Search term', type: String })
  searchQuery?: string;

  @ApiPropertyOptional({ description: 'pages ', type: String })
  page?: string;

  @ApiPropertyOptional({
    description: 'Limit the number of results ',
    type: String,
  })
  limit?: string;
}
