// backend/src/events/events.controller.ts
import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'; // <-- Add Patch, Param, Body, ParseIntPipe
import { EventService } from './event.service';
import { UpdateEventDto, CreateEventDto } from './event.dto'; // <-- Import the DTO
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { ApiConsumes } from '@nestjs/swagger/dist/decorators/api-consumes.decorator';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import multer from 'multer';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.getEventById(id);
  }

  @Get()
  GetAll() {
    return this.eventService.getAllEvents();
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.updateEvent(id, updateEventDto);
  }

  @Post()
  create(@Body() CreateEventDto: CreateEventDto) {
    return this.eventService.createEvent(CreateEventDto);
  }

  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    const updateEventDto: Partial<UpdateEventDto> = { status: 'deleted' };
    return this.eventService.updateEvent(id, updateEventDto as UpdateEventDto);
  }

  @Post('withImage')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  @ApiConsumes('multipart/form-data')
  createWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() CreateEventDto: CreateEventDto,
  ) {
    const categories: string[] = Array.isArray(CreateEventDto.categories)
      ? CreateEventDto.categories
      : [CreateEventDto.categories].filter(Boolean);

    const dto: CreateEventDto = {
      name: CreateEventDto.name,
      date: CreateEventDto.date,
      time: CreateEventDto.time,
      place: CreateEventDto.place,
      capacity: Number(CreateEventDto.capacity),
      detail: CreateEventDto.detail,
      cost: Number(CreateEventDto.cost ?? 0),
      status: CreateEventDto.status ?? 'active',
      userId: CreateEventDto.userId,
      categories,
    };
    return this.eventService.createEventWithImage(dto, file);
  }

  @Patch('withImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async updateEventWithImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const toNum = (v: any) => (v === '' || v == null ? undefined : Number(v));
    const categories: string[] = Array.isArray((body as any).categories)
      ? ((body as any).categories as string[])
      : [(body as any).categories as any].filter(Boolean);

    const dto: UpdateEventDto = {
      name: body.name,
      date: body.date,
      time: body.time,
      place: body.place,
      capacity: toNum((body as any).capacity),
      detail: body.detail,
      cost: toNum((body as any).cost),
      rating: toNum((body as any).rating),
      status: body.status,
      userId: toNum((body as any).userId),
      categories,
    };

    return this.eventService.updateEventWithImage(id, dto, file);
  }
}
