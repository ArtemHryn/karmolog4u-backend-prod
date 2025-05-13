import { InternalServerErrorException } from '@nestjs/common';
import { promises as fs } from 'fs'; // Importing fs.promises

export const fileDelete = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath); // Using fs.promises.unlink
  } catch (error) {
    throw new InternalServerErrorException('Помилка обробки зображення :(');
  }
};
