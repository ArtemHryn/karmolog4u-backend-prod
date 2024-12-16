import {
  Description,
  Name,
  Status,
} from 'src/products/meditations/schemas/meditation.schema';

export class CreateMeditationDto {
  /**
  Meditation category
  @example "OPEN"
  */
  category: string;

  /**
  Meditation name
  @example '{"ru": "some name", "uk": "some name"}'
  */
  name: Name;

  /**
  Meditation description
  @example '{"ru": "some description", "uk": "some description"}'
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

  // /**
  // Meditation status to delete
  // @example "false"
  // */
  // toDelete: boolean;

  /**
  Meditation status
  @example "PUBLISHED"
  */
  status: Status;

  discount: { discount: number; start: Date; expiredAt: Date };
}
