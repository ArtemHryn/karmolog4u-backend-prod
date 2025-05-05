import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LessonDocument = HydratedDocument<Lesson>;

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
export class Lesson {
  @Prop({ required: true })
  title: string;

  @Prop()
  description1?: string;

  @Prop()
  description2?: string;

  @Prop({ required: true, default: 'unlimited' }) // 'unlimited', 'period', 'until_date'
  accessType: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ type: [String], default: [] })
  videoLinks: string[];

  @Prop({ type: [{ title: String, link: String }], default: [] })
  additionalLinks: { title: string; link: string }[];

  @Prop()
  recommendations?: string;

  @Prop()
  homework?: string;

  @Prop({ type: [String], default: [] })
  homeworkFiles: string[];

  @Prop({ type: [String], default: [] })
  bonusFiles: string[];

  @Prop({ type: [String], default: [] })
  feedbackQuestions: string[];
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
