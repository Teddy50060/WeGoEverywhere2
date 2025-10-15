import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import sharp from 'sharp';
import { ImagesRepository } from './images.repository';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

@Injectable()
export class ImagesService {
  constructor(private readonly imagesRepo: ImagesRepository) {}

  async toWebp(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('no file uploaded');
    if (file.size > MAX_SIZE)
      throw new BadRequestException('file is too large');
    if (!ALLOWED_MIME.has(file.mimetype))
      throw new BadRequestException('invalid file type');

    const webp = await sharp(file.buffer).webp({ quality: 82 }).toBuffer();
    const meta = await sharp(webp).metadata();
    const width = meta.width ?? 0;
    const height = meta.height ?? 0;
    const sizeBytes = webp.length;
    const mime = 'image/webp';
    if (sizeBytes <= 0) throw new BadRequestException('invalid image data');
    const imageId = crypto.createHash('sha256').update(webp).digest('hex');
    return { imageId, mime, bytes: webp, width, height, sizeBytes };
  }

  async saveImageBuffer(file: Express.Multer.File) {
    const image = await this.toWebp(file);
    return this.imagesRepo.insertImage(null, image);
  }

  async getImageById(imageId: string) {
    return this.imagesRepo.getImageById(imageId);
  }

  async linkToEvent(eventId: number, imageId: string) {
    return this.imagesRepo.linkToEvent(null, eventId, imageId);
  }
}
