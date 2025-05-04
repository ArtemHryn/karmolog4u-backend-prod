import { ApiProperty } from '@nestjs/swagger';

export class Access {
  @ApiProperty({
    description: 'Access type',
    enum: ['PERMANENT', 'FOR_PERIOD', 'TO_DATE'],
    example: 'PERMANENT',
  })
  type: 'PERMANENT' | 'FOR_PERIOD' | 'TO_DATE';

  @ApiProperty({
    description: 'Access start date (if needed)',
    example: '2025-06-01T00:00:00.000Z',
    required: false,
  })
  dateStart?: Date;

  @ApiProperty({
    description: 'Access end date (if needed)',
    example: '2025-12-31T00:00:00.000Z',
    required: false,
  })
  dateEnd?: Date;
}

export class Point {
  @ApiProperty({
    description: 'Name of the point',
    example: 'Early Access',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the point',
    example: 'You will get early access to materials.',
  })
  description: string;
}
export class Contract {
  @ApiProperty({
    description: 'Date of the contract',
    example: '2025-07-01T00:00:00.000Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Sign up deadline date',
    example: '2025-06-30T00:00:00.000Z',
  })
  signUpTo: Date;

  @ApiProperty({
    description: 'Optional price for the contract',
    example: 299.99,
    required: false,
  })
  price?: number;

  @ApiProperty({
    description: 'Contract header or title',
    example: 'Special Summer Offer',
  })
  header: string;

  @ApiProperty({
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
  points: Point[];
}

export class Literature {
  @ApiProperty({
    description: 'Author of the literature piece',
    example: 'John Doe',
  })
  author: string;

  @ApiProperty({
    description: 'Link to the literature resource',
    example: 'https://example.com/book',
  })
  link: string;
}

export class CreateCourseDto {
  @ApiProperty({
    example: 'Advanced JavaScript',
    description: 'The name of the course',
  })
  name: string;

  @ApiProperty({
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
  type: string;

  @ApiProperty({
    example: 'ALL',
    description: 'Course completeness mode',
    enum: ['ALL', 'BY_LESSON'],
  })
  completeness: string;

  @ApiProperty({
    description: 'Access to course',
    type: Access,
    example: {
      type: 'PERMANENT',
      dateStart: '2025-03-10T17:20:14.504+00:00',
      dateEnd: '2025-03-10T17:20:14.504+00:00',
    },
  })
  access: Access;

  @ApiProperty({
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
  contract: Contract;

  @ApiProperty({
    example: 'https://chat.example.com',
    description: 'Link to course chat',
    required: false,
  })
  chat?: string;

  @ApiProperty({
    example: ['https://example.com/file1.pdf'],
    description: 'Additional course files',
    required: false,
  })
  additionalFiles?: string[];

  @ApiProperty({
    description: 'Optional links related to the course',
    type: [String],
    example: ['https://example.com/resource1', 'https://example.com/resource2'],
    required: false,
  })
  optionalLink?: string[];

  @ApiProperty({
    description: 'Optional file links related to the course',
    type: [String],
    example: ['https://example.com/file1.pdf', 'https://example.com/file2.pdf'],
    required: false,
  })
  optionalFiles?: string[];

  @ApiProperty({
    description: 'Link to the practice invoice',
    type: String,
    example: 'https://example.com/invoice',
  })
  practiceInvoice: string;

  @ApiProperty({
    description: 'Stream number of the course',
    type: Number,
    example: 1,
  })
  stream: number;

  @ApiProperty({
    description: 'Price of the course',
    type: Number,
    example: 199.99,
  })
  price: number;

  @ApiProperty({
    description: 'List of recommended literature',
    type: [Literature],
    example: [
      { author: 'John Doe', link: 'https://example.com/book' },
      { author: 'Jane Smith', link: 'https://example.com/article' },
    ],
    required: false,
  })
  literature?: Literature[];

  @ApiProperty({
    description: 'Cover image URL',
    type: String,
    example: 'https://example.com/cover.jpg',
    required: false,
  })
  cover?: string;

  @ApiProperty({
    description: 'Status of the course',
    enum: ['DRAFT', 'published', 'ARCHIVE'],
    example: 'DRAFT',
  })
  status: 'DRAFT' | 'published' | 'ARCHIVE';
}
