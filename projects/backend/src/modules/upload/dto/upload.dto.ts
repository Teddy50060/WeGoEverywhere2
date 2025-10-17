import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResponseDto {
  @ApiProperty({
    example: 'File uploaded successfully',
    description: 'A confirmation message of the upload status.',
  })
  message: string;

  @ApiProperty({
    example: 'uploads/1759205019636-hamtaro.png',
    description: 'The server path where the file was saved.',
  })
  filePath: string;
}