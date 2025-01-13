import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/role/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      // Remove the "_id" property when the object is serialized
      delete ret._id;
      delete ret.password;
    },
  },
})
export class User {
  @Prop({
    type: String,
    required: [true, 'name is required'],
  })
  name: string;

  @Prop({ type: String, required: [true, 'Last name is required'] })
  lastName: string;

  @Prop({ type: String, required: [true, 'Phone is required'] })
  mobPhone: string;

  @Prop({ type: String, required: [true, 'Password is required'] })
  password: string;

  @Prop({ type: String, required: [true, 'Email is required'], unique: true })
  email: string;

  @Prop({ type: Array, enum: ['ADMIN', 'USER'], default: 'USER' })
  role: Role[];

  // @Prop({ type: String, default: '' })
  // avatarUrl: string;

  // @Prop({ type: Array, default: [] })
  // supplies: [];

  @Prop({ type: Boolean, default: false })
  banned: boolean;

  @Prop({ type: Boolean, default: false })
  toDelete: boolean;

  @Prop({ type: String })
  createdAt: string;

  @Prop({ type: String })
  updatedAt: string;

  @Prop({ type: Date, default: null })
  expiredAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
