import { Controller, Post, UploadedFile, UseInterceptors  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { FileUploadResponseDto } from './dto/upload.dto';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload a single file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
    description: 'The file to upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'File has been successfully uploaded.',
    type: FileUploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request. No file provided.' })
  async uploadImage(@UploadedFile() file: Express.Multer.File, subfolder: string) {
        return this.uploadService.handleFileUpload(file, subfolder);
     
    }
}
