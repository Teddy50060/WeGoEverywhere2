import { Controller, Get, Patch, Param, Body, ParseIntPipe, Post, Delete, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { UpdateEventDto, CreateEventDto } from './event.dto';
import { JwtGuard } from '@backend/src/core/auth/jwt/access-jwt/jwt.guard';
import { GetUserId } from '@backend/src/shared/decorators/get-user-id.decorator';

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
  GetAll() {
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
  create(@Body() CreateEventDto: CreateEventDto) {
    return this.eventService.createEvent(CreateEventDto);
  }

  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    const updateEventDto = { status: 'deleted' };
    return this.eventService.updateEvent(id, updateEventDto);
  }

  @Get(':id/organizer')
  async getEventOrganizer(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.getEventOrganizer(id);
  }
}
