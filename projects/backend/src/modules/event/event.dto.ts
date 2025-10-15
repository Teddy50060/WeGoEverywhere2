// backend/src/events/dto/update-event.dto.ts

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  Min,
  IsDateString,
} from 'class-validator';

export class UpdateEventDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  place?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateEventWithImageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  place?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Optional new image file to upload',
  })
  @IsOptional()
  file?: any;
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
}

export class CreateEventDto {
  @ApiPropertyOptional()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiPropertyOptional()
  @IsDateString()
  date!: string;

  @ApiPropertyOptional()
  @IsString()
  time!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  place?: string;

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  capacity!: number;

  @ApiPropertyOptional()
  @IsString()
  detail!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional()
  @IsInt()
  userId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateEventWithImageDto {
  @ApiPropertyOptional()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiPropertyOptional()
  @IsDateString()
  date!: string;

  @ApiPropertyOptional()
  @IsString()
  time!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  place?: string;

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  capacity!: number;

  @ApiPropertyOptional()
  @IsString()
  detail!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional()
  @IsInt()
  userId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  file: any;
}
