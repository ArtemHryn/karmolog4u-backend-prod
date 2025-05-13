import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;
export class access {
  @Prop({ required: true, enum: ['PERMANENT', 'FOR_PERIOD', 'TO_DATE'] })
  type: string;
  dateStart: Date;
  dateEnd: Date;
}

export class literature {
  author: string;
  link: string;
}

export class optionalLink {
  name: string;
  link: string;
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      // Remove the "_id" property when the object is serialized
      delete ret._id;
    },
  },
})
export class Course {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: [
      'SSK_INDEPENDENT',
      'SSK_WITH_CURATOR',
      'SSK_WITH_SERGIY',
      'ADVANCED',
      'CONSULTING',
    ],
  })
  type: string;

  @Prop({ required: true, enum: ['ALL', 'BY_LESSON'] })
  completeness: string;

  @Prop({
    type: access,
  })
  access: access;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
  })
  contract: mongoose.Types.ObjectId;

  @Prop({ type: String, default: '' })
  chat: string;

  @Prop({
    type: [
      {
        name: String,
        link: String,
      },
    ],
    default: [],
  })
  optionalLink: optionalLink[];

  @Prop({ type: [String], default: [] })
  optionalFiles?: string[];

  @Prop({ type: String, default: '' })
  practiceInvoice: string;

  @Prop({ type: String, default: 0 })
  stream: number;

  @Prop({ type: Number, default: 0 })
  price: number;

  @Prop({
    type: [
      {
        author: String,
        link: String,
      },
    ],
    default: [],
  })
  literature: literature[];

  @Prop({ type: String, default: '' })
  cover: string;

  @Prop({
    required: true,
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVE'],
  })
  status: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
