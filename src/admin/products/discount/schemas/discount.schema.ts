import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type DiscountDocument = HydratedDocument<Discount>;

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
export class Discount {
  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: Date, default: Date.now })
  start: Date;

  @Prop({ type: Date, default: null, index: { expires: 0 } })
  expiredAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  // @Type(() => Object) // Примусова трансформація об'єкта для валідації
  refId: mongoose.Schema.Types.ObjectId;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
