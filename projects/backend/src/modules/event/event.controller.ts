import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Post,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { EventService } from './event.service';
import { UpdateEventDto, CreateEventDto } from './event.dto';
import { JwtGuard } from '@backend/src/core/auth/jwt/access-jwt/jwt.guard';
import { GetUserId } from '@backend/src/shared/decorators/get-user-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { ApiConsumes } from '@nestjs/swagger/dist/decorators/api-consumes.decorator';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import multer from 'multer';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtGuard)
  @Delete(':id/join')
  async unjoinEvent(@Param('id', ParseIntPipe) id: number, @GetUserId() userId: number) {
    return this.eventService.unjoinEvent(id, userId);
  }

  @UseGuards(JwtGuard)
  @Post(':id/join')
  async joinEvent(@Param('id', ParseIntPipe) id: number, @GetUserId() userId: number) {
    return this.eventService.joinEvent(id, userId);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.getEventById(id);
  }

  @Get()
  getAll() {
    return this.eventService.getAllEvents();
  }

  @UseGuards(JwtGuard)
  @Get('user/joined')
  getUserJoinedEvents(@GetUserId() userId: number) {
    return this.eventService.getUserJoinedEvents(userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.updateEvent(id, updateEventDto);
  }

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
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
    @Body() createEventDto: CreateEventDto,
  ) {
    const categories: string[] = Array.isArray(createEventDto.categories)
      ? createEventDto.categories
      : [createEventDto.categories].filter(Boolean);

    const dto: CreateEventDto = {
      name: createEventDto.name,
      date: createEventDto.date,
      time: createEventDto.time,
      place: createEventDto.place,
      capacity: Number(createEventDto.capacity),
      detail: createEventDto.detail,
      cost: Number(createEventDto.cost ?? 0),
      status: createEventDto.status ?? 'active',
      userId: createEventDto.userId,
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

  @Get(':id/organizer')
  async getEventOrganizer(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.getEventOrganizer(id);
  }
}
