import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

export const fileCompress = async (file: any, configService: ConfigService) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [name, extension] = file.filename.split('.');
  const compressedPath = path.join('./covers', `${name}.webp`);
  fs.mkdirSync(path.dirname(compressedPath), { recursive: true });

  // Стиснення зображення
  await sharp(file.path)
    .resize(800) // Змінює ширину до 800 пікселів, зберігаючи співвідношення сторін
    .webp({ quality: 75 }) // Конвертує в JPEG з якістю 70%
    .toFile(compressedPath); // Зберігає файл

  //delete temporary image
  fs.unlink(file.path, (err) => {
    if (err) {
      console.error(`Помилка при видаленні файлу: ${err.message}`);
      new Error(err.message);
    } else {
      console.log('Файл успішно видалено');
    }
  });
  //crate link for image
  const envValue = configService.get<string>('SERVER_IP');
  return `${envValue}${compressedPath}`;
};
