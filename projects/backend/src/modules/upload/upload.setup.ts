import { INestApplication } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export function setupUploads(app: INestApplication): void {
  const uploadDir = join(process.cwd(), 'uploads');

  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }

  app.use('/uploads', express.static(uploadDir));
}