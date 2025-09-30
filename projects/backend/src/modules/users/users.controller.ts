import { Controller, Get, Patch, Param, Body, ParseIntPipe , Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common'; // <-- Add Patch, Param, Body, ParseIntPipe
import { UserService } from './users.service';
import { UpdateUserDto } from './users.dto'; // <-- Import the DTO
import { GetUserId } from '@backend/src/shared/decorators/get-user-id.decorator';
import { UploadService } from '../upload/upload.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('users')
export class UserController{
    constructor(private readonly userService: UserService,
        private readonly uploadService: UploadService,
     ){}

    @Patch('edit') // ไม่ต้องมี :id เพราะเอาจาก JWT
    update(
    @GetUserId() id: number,
    @Body() updateUserDto: UpdateUserDto
    ) {
        return this.userService.update(id, updateUserDto);
    }

    @Get()
    Getall(){
        return this.userService.getAllUsers();
    }
    
    @Patch('profile-picture')
    @UseInterceptors(FileInterceptor('file', {
      dest: './uploads/_temp', //temp folder -> real
    }),
    )
    async uploadProfilePicture(
        @GetUserId() userId: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('No file provided for upload.');
        }
        const uploadResult = await this.uploadService.handleFileUpload(
            file,
            'profile-pictures',
        );

        const dtoForUpdate = { profilePicture: uploadResult.filePath };
        const updatedUser = await this.userService.update(userId, dtoForUpdate);

        return updatedUser;
    }
}