import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { rename } from 'fs/promises';
import { extname, join } from 'path';

@Injectable()
export class UploadService {
  async handleFileUpload(file: Express.Multer.File, subfolder: string) {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }

    // validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    // validate file size (e.g., max 10mb)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }

    const destination = join(process.cwd(), 'uploads', subfolder);
    const fileExtension = extname(file.originalname);
    const uniqueFilename = `file-${Date.now()}${fileExtension}`;
    const newPath = join(destination, uniqueFilename);

    if (!existsSync(destination)) {
      mkdirSync(destination, { recursive: true });
    }

    try {
      // middle ware path -> real path
      await rename(file.path, newPath);
    } catch (error) {
      console.error('Error moving file:', error);
      throw new InternalServerErrorException('Failed to save the uploaded file.');
    }
    
    // return path for file
    const webAccessiblePath = `/uploads/${subfolder}/${uniqueFilename}`;
    return { filePath: webAccessiblePath };
  }
}
