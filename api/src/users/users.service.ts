import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from "typeorm";
import { users } from "./users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./create-user.dto";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(users) private usersRepository: Repository<users>) {}

    async create(user: CreateUserDto): Promise<users> {
        return await this.usersRepository.save(user);
    }
}
