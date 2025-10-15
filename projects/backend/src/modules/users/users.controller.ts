import { Controller, Get, Patch, Param, Body, ParseIntPipe , Post, Delete, UseGuards } from '@nestjs/common'; // <-- Add Patch, Param, Body, ParseIntPipe
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
    @UseGuards(JwtGuard)
    @Delete('me') 
    deleteMe(@GetUserId() id: number) {
        return this.userService.deleteUser(id);
    }

}