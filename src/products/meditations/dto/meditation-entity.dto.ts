import { IsOptional } from 'class-validator';
import { Description, Name, Status } from '../schemas/meditation.schema';
import { Types } from 'mongoose';

export class MeditationEntity {
  /**
  Meditation id
  @example "6744d2c8bd8f6d722ff28c49"
  */
  _id?: Types.ObjectId;

  /**
  Meditation category
  @example "open"
  */
  category: string;

  /**
  Meditation name
  @example {ru: 'some name', ua: 'some name'}
  */
  name: Name;

  /**
  Meditation description
  @example {ru: 'some description', ua: 'some description'}
  */
  description: Description;

  /**
  Meditation video link
  @example "some link"
  */
  video: string;

  /**
  Meditation cover link 
  @example "some link"
  */
  cover: string;

  /**
  Meditation price
  @example "10"
  */
  price: number;

  /**
  Meditation status is waiting
  @example "false"
  */
  isWaiting: boolean;

  /**
  Meditation status to delete
  @example "false"
  */
  toDelete: boolean;

  /**
  Meditation status
  @example "PUBLISHED"
  */
  status: Status;

  discount?: any;
}
