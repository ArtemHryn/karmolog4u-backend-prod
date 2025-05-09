import * as fs from 'fs/promises';
import * as path from 'path';

export async function findFile(fileName: string): Promise<string | null> {
  const directories = ['covers', 'temporary'];

  for (const dir of directories) {
    // const filePath = path.resolve(__dirname, '..', '..', dir, fileName);
    console.log(`${dir}/${fileName}`);

    try {
      await fs.access(`${dir}/${fileName}`); // Check if file exists asynchronously
      return dir; // Return directory where file was found
    } catch (error) {
      // Ignore errors (file not found) and continue checking other directories
    }
  }

  return null; // File not found in any directory
}
