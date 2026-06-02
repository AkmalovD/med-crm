import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {Roles} from "../auth/decorators/roles.decorator";
import {UserRole} from "@prisma/client";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Roles(UserRole.ADMIN)
    @Post()
    create(@Body() CreateUserDto: CreateUserDto) {
        return this.usersService.create(CreateUserDto)
    }

    @Roles(UserRole.ADMIN)
    @Get()
    findAll() {
        return this.usersService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id)
    }

    @Roles(UserRole.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id)
    }
}
