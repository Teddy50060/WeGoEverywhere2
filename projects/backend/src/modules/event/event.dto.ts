// backend/src/events/dto/update-event.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  Min,
  IsDateString,
  IsArray,
  ArrayMinSize,
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
  status?: string; // ถ้ามี enum ใช้ enum ดีกว่า

  @ApiPropertyOptional({ isArray: true, type: String })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagePath?: string;
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
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiPropertyOptional({ example: '2025-11-30' })
  @IsDateString()
  date!: string;

  @ApiPropertyOptional({ example: '14:30:00' })
  @IsString()
  time!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  place?: string;

  @ApiPropertyOptional({ example: '5' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity!: number;

  @ApiPropertyOptional({ example: 'this is Detail' })
  @IsString()
  detail!: string;

  @ApiPropertyOptional({ example: 5.0 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({ example: 15 })
  @Type(() => Number)
  @IsInt()
  userId!: number;

  @ApiPropertyOptional({
    type: [String],
    example: [
      'Entertainment',
      'Education',
      'Health',
      'Lifestyle',
      'Technology',
      'Environment',
    ],
    description: 'Must have at least 1 category',
  })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : value == null || value === ''
        ? []
        : [String(value)],
  )
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  categories: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagePath?: string;

  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsString()
  status?: string; // ถ้ามี enum ใช้ enum ดีกว่า

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Image file to upload',
  })
  @IsOptional()
  file?: Express.Multer.File;
}
