import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

export type ContractDocument = HydratedDocument<Contract>;

export class Point {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
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
export class Contract {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Date, required: true })
  signUpTo: Date;

  @Prop({ type: Number, required: false })
  price: number;

  @Prop({ type: String, required: true })
  header: string;

  @Prop({ type: [{ name: String, description: String }], default: [] })
  points: Point[];
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
