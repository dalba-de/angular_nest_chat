import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { users } from "./users.entity";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./create-user.dto";

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Post('create')
    async create(@Body() user: CreateUserDto): Promise<any> {
      return this.usersService.create(user);
    }
}
