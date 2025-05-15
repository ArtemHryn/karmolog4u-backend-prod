import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  findFileInMaterials,
  findFileInCovers,
} from 'src/common/helper/findRecursive';

@Injectable()
export class StorageService {
  //   constructor() {}

  async getCover(fileName: string) {
    const rootFolder = path.join(process.cwd(), '..', 'storage'); // Коренева папка для пошуку
    const filePath = await findFileInCovers(rootFolder, fileName);
    return filePath;
  }

  async getFile(fileName: string) {
    const rootFolder = path.join(process.cwd(), '..', 'storage'); // Коренева папка для пошуку
    const filePath = await findFileInMaterials(rootFolder, fileName);
    return filePath;
  }

  getTemporaryCover(fileName: string) {
    const filePath = path.join(process.cwd(), 'temporaryCovers', fileName); // Коренева папка для пошуку
    return filePath;
  }

  getTemporaryFile(fileName: string) {
    const filePath = path.join(process.cwd(), 'temporaryFiles', fileName); // Коренева папка для пошуку
    return filePath;
  }

  async createFolder(folderPath: string): Promise<string> {
    try {
      // Перевіряємо, чи існує папка
      try {
        await fs.access(folderPath);
        console.log(`Папка вже існує: ${folderPath}`);
        this.logFilesInFolder(folderPath);
        return folderPath;
      } catch {
        // Якщо папка не існує, створюємо її
        await fs.mkdir(folderPath, { recursive: true });
        console.log(`Папка створена успішно: ${folderPath}`);
        return folderPath;
      }
    } catch (error) {
      console.error(`Помилка при створенні папки: ${error.message}`);
      throw error;
    }
  }

  async logFilesInFolder(folderPath: string): Promise<void> {
    try {
      // Перевіряємо, чи існує папка
      await fs.access(folderPath);

      // Читаємо вміст папки
      const files = await fs.readdir(folderPath);

      if (files.length === 0) {
        console.log(`Папка пуста: ${folderPath}`);
      } else {
        console.log(`Файли в ${folderPath}:`);
        files.forEach((file) => console.log(file));
      }
    } catch (error) {
      console.error(`Помилка доступу до папки: ${error.message}`);
    }
  }

  async createCourseStorage(courseId: string): Promise<string> {
    try {
      const courseFolder = path.join(
        process.cwd(),
        '..',
        'storage',
        'education',
        courseId,
      ); // Шлях до папки
      await fs.mkdir(courseFolder, { recursive: true });

      const folders = ['covers', 'materials'];

      for (const folder of folders) {
        const fullPath = path.join(courseFolder, folder);
        await fs.mkdir(fullPath, { recursive: true }); // Створює папку, якщо її не існує
      }

      console.log(`Сховище курсу створено: ${courseFolder}`);
      return courseFolder;
    } catch (error) {
      throw new BadRequestException('Помилка створення сховища :(');
    }
  }

  async createStorageFolder() {
    const storageFolder = path.join(process.cwd(), '..', 'storage'); // Шлях до папки
    const educationFolder = path.join(
      process.cwd(),
      '..',
      'storage',
      'education',
    ); // Шлях до папки
    const coversFolder = path.join(process.cwd(), '..', 'storage', 'covers'); // Шлях до папки
    await this.createFolder(storageFolder);
    await this.createFolder(educationFolder);
    await this.createFolder(coversFolder);
  }

  async moveFiles(
    fileLinks: string[],
    tempFolder: string,
    storageFolder: string,
  ): Promise<string[]> {
    try {
      await fs.mkdir(storageFolder, { recursive: true }); // Ensure storage folder exists

      const updatedLinks: string[] = [];

      for (const fileLink of fileLinks) {
        const fileName = path.basename(fileLink); // Extract filename from URL or path
        const tempPath = path.join(tempFolder, fileName); // Temporary file path
        const storagePath = path.join(storageFolder, fileName); // New storage location

        await fs.rename(tempPath, storagePath); // Move file
        console.log(`Moved: ${fileName} → ${storagePath}`);

        // Update the link to replace "temporaryCovers" with "covers"
        const updatedLink = fileLink.replace('/temporaryFiles/', '/file/');
        updatedLinks.push(updatedLink);
      }

      return updatedLinks;
    } catch (error) {
      console.error(`Error moving files: ${error.message}`);
      return [];
    }
  }
  getTempFilesFolder() {
    const filePath = path.join(process.cwd(), 'temporaryFiles');
    return filePath;
  }
  getTempCoversFolder() {
    const filePath = path.join(process.cwd(), 'temporaryCovers');
    return filePath;
  }
  getSubFolderPath(rootPath: string, subFolder: string) {
    const filePath = path.join(rootPath, subFolder);
    return filePath;
  }

  getPathTempCover(fileName: string) {
    const filePath = path.join('temporaryCovers', fileName);
    return filePath;
  }
}
