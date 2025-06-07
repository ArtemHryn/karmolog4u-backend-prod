import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type LessonDocument = HydratedDocument<Lesson>;

@Schema({ _id: false })
class Access {
  @Prop({
    required: true,
    type: String,
    enum: ['PERMANENT', 'FOR_PERIOD', 'TO_DATE'],
  })
  type: string;

  @Prop({ type: Date })
  dateStart: Date;

  @Prop({ type: Date })
  dateEnd: Date;

  @Prop({ type: Number, required: false })
  months: number;
}

@Schema({ _id: false })
export class AdditionalLink {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
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
export class Lesson {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  targetId: mongoose.Types.ObjectId;

  @Prop({ required: true, enum: ['Course', 'Module'] })
  targetModel: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ type: String, default: '' })
  description1: string;

  @Prop({ type: String, default: '' })
  description2: string;

  @Prop({ required: false, type: Access })
  accessType: Access;

  @Prop({ type: [String], default: [] })
  videoLinks: string[];

  @Prop({ type: AdditionalLink, default: [] })
  additionalLinks: AdditionalLink[];

  @Prop({ type: String, default: '' })
  recommendations: string;

  @Prop({ type: String, default: '' })
  homework: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Files' }],
    default: [],
  })
  homeworkFiles: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Files' }],
    default: [],
  })
  bonusFiles: mongoose.Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  feedbackQuestions: string[];
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
