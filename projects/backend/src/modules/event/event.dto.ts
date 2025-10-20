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
  @ApiPropertyOptional({ example: 'Test2' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cost?: number;

  @ApiPropertyOptional({ example: '2025-12-15' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: '01:30:00' })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional({ example: 'Place' })
  @IsOptional()
  @IsString()
  place?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ example: 'This is Details' })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiPropertyOptional({ example: 5.0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rating?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;

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
  @IsOptional()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagePath?: string;

  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsString()
  status?: string; // ถ้ามี enum ใช้ enum ดีกว่า

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Image file to upload',
  })
  @IsOptional()
  file?: Express.Multer.File;
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
}

export class CreateEventDto {
  @ApiPropertyOptional({ example: 'Test1' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 45 })
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
  @IsOptional()
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

