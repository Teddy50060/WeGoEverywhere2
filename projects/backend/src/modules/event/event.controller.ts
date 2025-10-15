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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'; // <-- Add Patch, Param, Body, ParseIntPipe
import { EventService } from './event.service';
import {
  UpdateEventDto,
  CreateEventDto,
  CreateEventWithImageDto,
  UpdateEventWithImageDto,
} from './event.dto'; // <-- Import the DTO
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiConsumes } from '@nestjs/swagger/dist/decorators/api-consumes.decorator';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { memoryStorage } from 'multer';

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

  @Patch(':id/with-image')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateEventWithImageDto })
  async updateWithImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventWithImageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.eventService.updateEventWithImage(id, dto, file);
  }

  @Post()
  create(@Body() CreateEventDto: CreateEventDto) {
    return this.eventService.createEvent(CreateEventDto);
  }

  @Post('with-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create event with image' })
  createWithImage(
    @Body() dto: CreateEventWithImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventService.createEventWithImage(dto, file);
  }

  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    const updateEventDto = { status: 'deleted' };
    return this.eventService.updateEvent(id, updateEventDto);
  }
}
