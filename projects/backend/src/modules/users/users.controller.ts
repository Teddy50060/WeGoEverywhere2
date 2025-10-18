import { Controller, Get, Patch, Param, Body, ParseIntPipe , Post, Delete, UseGuards } from '@nestjs/common';
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
}