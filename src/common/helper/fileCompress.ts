import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { HttpException } from '@nestjs/common';
import { fileDelete } from './fileDelete';

export const fileCompress = async (file: any, configService: ConfigService) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [name, extension] = file.filename.split('.');
    // const outputDir = path.resolve(__dirname, 'covers');
    // const compressedPath = path.join(outputDir, `${name}.webp`);
    const compressedPath = `covers/${name}.webp`;

    fs.mkdirSync(path.dirname(compressedPath), { recursive: true });

    // Стиснення зображення
    await sharp(file.path)
      .resize(800) // Змінює ширину до 800 пікселів, зберігаючи співвідношення сторін
      .webp({ quality: 75 }) // Конвертує в JPEG з якістю 70%
      .toFile(compressedPath); // Зберігає файл

    await fileDelete(file.path);

    //crate link for image
    const envValue = configService.get<string>('SERVER_IP');
    return `${envValue}${compressedPath}`;
  } catch (error) {
    throw new HttpException(
      {
        status: error.status,
        message: error.response.message,
        error: error.response.error,
      },
      error.status,
      {
        cause: error,
      },
    );
  }
};
