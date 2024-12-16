import * as fs from 'fs';
export const fileDelete = (filePath: any) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Помилка при видаленні файлу: ${err.message}`);
      new Error(err.message);
    } else {
      console.log('Файл успішно видалено');
    }
  });
};
