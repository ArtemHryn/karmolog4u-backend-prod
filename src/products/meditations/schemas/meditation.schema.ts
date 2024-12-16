import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type MeditationDocument = HydratedDocument<Meditation>;

export interface Name {
  ru: string;
  uk: string;
}

export interface Description {
  ru: string;
  uk: string;
}

export enum Status {
  PUBLISHED = 'PUBLISHED',
  HIDDEN = 'HIDDEN',
  DRAFT = 'DRAFT',
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
export class Meditation {
  @Prop({
    type: String,
    enum: ['OPENED', 'CLOSED', 'ARCANES'],
    required: [true, 'category is required'],
  })
  category: string;

  @Prop({ type: Object, default: { ru: '', uk: '' } })
  name: Name;

  @Prop({ type: Object, default: { ru: '', uk: '' } })
  description: Description;

  @Prop({ type: String, default: '' })
  video: string;

  @Prop({ type: String, default: '' })
  cover: string;

  @Prop({ type: Number, default: 0 })
  price: number;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Discount', default: '' })
  // discount: Discount;

  @Prop({ type: Boolean, default: false })
  isWaiting: boolean;

  @Prop({ type: Boolean, default: false })
  toDelete: boolean;

  @Prop({
    type: String,
    enum: ['PUBLISHED', 'HIDDEN', 'DRAFT'],
    default: 'DRAFT',
  })
  status: Status;

  @Prop({ type: Date, default: null, index: { expires: 0 } })
  expiredAt: Date;
}

export const MeditationSchema = SchemaFactory.createForClass(Meditation);
