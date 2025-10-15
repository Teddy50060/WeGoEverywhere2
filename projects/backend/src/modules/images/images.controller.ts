import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Header,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { ImagesService } from './images.service';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly images: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiOperation({ summary: 'Upload image to DB as WebP (lean)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Uploaded' })
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.images.saveImageBuffer(file);
  }

  @Post('upload/for-event/:eventId')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload image and link it to an event' })
  @ApiParam({ name: 'eventId', type: Number, required: true })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' }, // <-- ให้ Swagger สร้างช่องเลือกไฟล์
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Uploaded & linked' })
  async uploadForEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const meta = await this.images.saveImageBuffer(file); // อัปโหลดเข้า DB
    await this.images.linkToEvent(eventId, meta.imageId); // ผูกกับ event
    return meta; // { imageId, mime, width, height, sizeBytes }
  }

  @Get(':id')
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  @ApiOperation({ summary: 'Stream image by id' })
  async stream(@Param('id') id: string, @Res() res: Response) {
    const img = await this.images.getImageById(id);
    res.setHeader('Content-Type', img.mime);
    res.send(img.bytes);
  }
}
