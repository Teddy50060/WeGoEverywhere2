import { Controller, Get, Patch, Param, Body, ParseIntPipe , Post, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ApiConsumes } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { Public } from '@backend/src/shared/decorators/public.decorator';
import { UserService } from './users.service';
import { UpdateUserDto } from './users.dto'; // <-- Import the DTO
import { GetUserId } from '@backend/src/shared/decorators/get-user-id.decorator';
import { JwtGuard } from '@backend/src/core/auth/jwt/access-jwt/jwt.guard';

@Controller('users')
export class UserController{
    constructor(private readonly userService: UserService ){}

    @Patch('edit') // ไม่ต้องมี :id เพราะเอาจาก JWT
    update(
    @GetUserId() id: number,
    @Body() updateUserDto: UpdateUserDto
    ) {
        return this.userService.update(id, updateUserDto);
    }

    @Get('user')
    getUser(
        @GetUserId() id: number,
    ){
        return this.userService.getUser(id);
    }

    @Get()
    Getall(){
        return this.userService.getAllUsers();
    }
    /**
     * Get public user profile by ID
     * GET /users/:id
     */
    @Public()
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        // You may want to select only public fields
        const user = await this.userService.findById(id);
        if (!user) {
            return { statusCode: 404, message: 'User not found' };
        }
        // No password field present, just return user
        return user;
    }
    @UseGuards(JwtGuard)
    @Delete('me') 
    deleteMe(@GetUserId() id: number) {
        return this.userService.deleteUser(id);
    }

    @UseGuards(JwtGuard)
    @Get('me')
    async getMe(@GetUserId() userId: number) {
      return this.userService.getPublicProfileById(userId);
    }

        /**
         * Upload user profile picture
         * POST /users/profile-picture
         */
        @UseGuards(JwtGuard)
        @Post('profile-picture')
        @UseInterceptors(FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    cb(null, path.join(__dirname, '../../../uploads/profile'));
                },
                filename: (req, file, cb) => {
                    const ext = path.extname(file.originalname);
                    const filename = uuidv4() + ext;
                    cb(null, filename);
                },
            }),
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.startsWith('image/')) {
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
        }))
        @ApiConsumes('multipart/form-data')
        async uploadProfilePicture(
            @GetUserId() userId: number,
            @UploadedFile() file: Express.Multer.File
        ) {
            if (!file) {
                return { statusCode: 400, message: 'No file uploaded' };
            }
            // Save relative path to DB
            const relativePath = `/uploads/profile/${file.filename}`;
            await this.userService.update(userId, { profilePicture: relativePath });
            return { profilePicture: relativePath };
        }
}