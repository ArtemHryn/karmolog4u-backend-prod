import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { fileDelete } from './fileDelete';

import { exec } from 'child_process';

export const fileCompress = async (file: any, configService: ConfigService) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [name, extension] = file.filename.split('.');
    const outputDir = path.resolve(process.cwd(), 'covers');
    const compressedPath = path.join(outputDir, `${name}.webp`);
    // const compressedPath = `/covers/${name}.webp`;
    console.log(compressedPath);

    exec('ls -d */', (err, stdout, stderr) => {
      if (err || stderr) {
        return console.error('Помилка:', err || stderr);
      }
      const folders = stdout.split('\n').filter((folder) => folder);
      console.log('Список папок:', folders);
    });

    // fs.mkdirSync(path.dirname(compressedPath), { recursive: true });
    try {
      await sharp(file.path)
        // .resize(800) // Змінює ширину до 800 пікселів, зберігаючи співвідношення сторін
        // .webp({ quality: 75 }) // Конвертує в JPEG з якістю 70%
        .toFile(compressedPath); // Зберігає файл
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    // Стиснення зображення

    await fileDelete(file.path);

    //crate link for image
    const envValue = configService.get<string>('SERVER_IP');
    return `${envValue}${compressedPath}`;
  } catch (error) {
    console.error(error);

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
