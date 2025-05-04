import { ApiPropertyOptional } from '@nestjs/swagger';

export class Access {
  @ApiPropertyOptional({
    description: 'Access type',
    enum: ['PERMANENT', 'FOR_PERIOD', 'TO_DATE'],
    example: 'PERMANENT',
  })
  type?: 'PERMANENT' | 'FOR_PERIOD' | 'TO_DATE';

  @ApiPropertyOptional({
    description: 'Access start date (if needed)',
    example: '2025-06-01T00:00:00.000Z',
    required: false,
  })
  dateStart?: Date;

  @ApiPropertyOptional({
    description: 'Access end date (if needed)',
    example: '2025-12-31T00:00:00.000Z',
    required: false,
  })
  dateEnd?: Date;
}

export class Point {
  @ApiPropertyOptional({
    description: 'Name of the point',
    example: 'Early Access',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the point',
    example: 'You will get early access to materials.',
  })
  description?: string;
}
export class Contract {
  @ApiPropertyOptional({
    description: 'Date of the contract',
    example: '2025-07-01T00:00:00.000Z',
  })
  date?: Date;

  @ApiPropertyOptional({
    description: 'Sign up deadline date',
    example: '2025-06-30T00:00:00.000Z',
  })
  signUpTo?: Date;

  @ApiPropertyOptional({
    description: 'Optional price for the contract',
    example: 299.99,
    required: false,
  })
  price?: number;

  @ApiPropertyOptional({
    description: 'Contract header or title',
    example: 'Special Summer Offer',
  })
  header?: string;

  @ApiPropertyOptional({
    description: 'List of important points',
    type: [Point],
    example: [
      {
        name: 'Guarantee',
        description: 'Full money-back guarantee within 30 days.',
      },
      { name: 'Support', description: '24/7 customer support.' },
    ],
  })
  points?: Point[];
}

export class Literature {
  @ApiPropertyOptional({
    description: 'Author of the literature piece',
    example: 'John Doe',
  })
  author?: string;

  @ApiPropertyOptional({
    description: 'Link to the literature resource',
    example: 'https://example.com/book',
  })
  link?: string;
}

export class UpdateCourseDto {
  @ApiPropertyOptional({
    example: 'Advanced JavaScript',
    description: 'The name of the course',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'SSK_WITH_CURATOR',
    description: 'The type of course',
    enum: [
      'SSK_INDEPENDENT',
      'SSK_WITH_CURATOR',
      'SSK_WITH_SERGIY',
      'ADVANCED',
      'CONSULTING',
    ],
  })
  type?: string;

  @ApiPropertyOptional({
    example: 'ALL',
    description: 'Course completeness mode',
    enum: ['ALL', 'BY_LESSON'],
  })
  completeness?: string;

  @ApiPropertyOptional({
    description: 'Access to course',
    type: Access,
    example: {
      type: 'PERMANENT',
      dateStart: '2025-03-10T17:20:14.504+00:00',
      dateEnd: '2025-03-10T17:20:14.504+00:00',
    },
  })
  access?: Access;

  @ApiPropertyOptional({
    description: 'Contract details',
    type: Contract,
    example: {
      date: '2025-07-01T00:00:00.000Z',
      signUpTo: '2025-06-30T00:00:00.000Z',
      price: 299.99,
      header: 'Special Summer Offer',
      points: [
        {
          name: 'Guarantee',
          description: 'Full money-back guarantee within 30 days.',
        },
        {
          name: 'Support',
          description: '24/7 customer support available.',
        },
      ],
    },
  })
  contract?: Contract;

  @ApiPropertyOptional({
    example: 'https://chat.example.com',
    description: 'Link to course chat',
    required: false,
  })
  chat?: string;

  @ApiPropertyOptional({
    example: ['https://example.com/file1.pdf'],
    description: 'Additional course files',
    required: false,
  })
  additionalFiles?: string[];

  @ApiPropertyOptional({
    description: 'Optional links related to the course',
    type: [String],
    example: ['https://example.com/resource1', 'https://example.com/resource2'],
    required: false,
  })
  optionalLink?: string[];

  @ApiPropertyOptional({
    description: 'Optional file links related to the course',
    type: [String],
    example: ['https://example.com/file1.pdf', 'https://example.com/file2.pdf'],
    required: false,
  })
  optionalFiles?: string[];

  @ApiPropertyOptional({
    description: 'Link to the practice invoice',
    type: String,
    example: 'https://example.com/invoice',
  })
  practiceInvoice?: string;

  @ApiPropertyOptional({
    description: 'Stream number of the course',
    type: Number,
    example: 1,
  })
  stream?: number;

  @ApiPropertyOptional({
    description: 'Price of the course',
    type: Number,
    example: 199.99,
  })
  price?: number;

  @ApiPropertyOptional({
    description: 'List of recommended literature',
    type: [Literature],
    example: [
      { author: 'John Doe', link: 'https://example.com/book' },
      { author: 'Jane Smith', link: 'https://example.com/article' },
    ],
    required: false,
  })
  literature?: Literature[];

  @ApiPropertyOptional({
    description: 'Cover image URL',
    type: String,
    example: 'https://example.com/cover.jpg',
    required: false,
  })
  cover?: string;

  @ApiPropertyOptional({
    description: 'Status of the course',
    enum: ['DRAFT', 'published', 'ARCHIVE'],
    example: 'DRAFT',
  })
  status: 'DRAFT' | 'published' | 'ARCHIVE';
}
