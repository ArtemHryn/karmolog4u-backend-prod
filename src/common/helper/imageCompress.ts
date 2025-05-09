import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { fileDelete } from './fileDelete';
import * as path from 'path';

export const fileCompress = async (
  fileName: string,
  configService: ConfigService,
  destination: string,
) => {
  try {
    const tempDir = path.join(process.cwd(), 'temporary'); // Define the temporary folder path
    const filePath = path.join(tempDir, fileName); // Get full file path in temporary folder

    // Ensure the filename has an extension before splitting
    if (!fileName.includes('.')) {
      throw new HttpException('Invalid file name format', 400);
    }

    const [name] = fileName.split('.');
    const compressedPath = path.join(
      process.cwd(),
      'dist/covers',
      `${name}.webp`,
    );

    try {
      await sharp(filePath)
        .resize(800) // Resize the image
        .webp({ quality: 75 }) // Convert to WebP format
        .toFile(compressedPath); // Save compressed file
    } catch (error) {
      throw new InternalServerErrorException(
        `Compression failed: ${error.message}`,
      );
    }

    // Delete the original file after compression
    await fileDelete(filePath);

    // Generate the accessible link for the compressed image
    const envValue = configService.get<string>('SERVER_IP');
    return `${envValue}/covers/${name}.webp`;
  } catch (error) {
    throw new HttpException(
      {
        status: error.status || 500,
        message:
          error.response?.message ||
          'An error occurred while processing the file',
        error: error.response?.error || 'Internal Server Error',
      },
      error.status || 500,
      {
        cause: error,
      },
    );
  }
};
