import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
export const fileDelete = async (filePath: any): Promise<void> => {
  try {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) return reject(err); // Відправляє помилку далі
        resolve(); // Файл успішно видалено
      });
    });
  } catch (error) {
    throw new InternalServerErrorException(error);
  }
};
