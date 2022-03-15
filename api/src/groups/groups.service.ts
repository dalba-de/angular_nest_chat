import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Group } from "./entities/group.entity";
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {

  constructor(@InjectRepository(Group)
  private groupsRepository: Repository<Group>) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    return await this.groupsRepository.save(createGroupDto);
  }

  async findAll() {
    return await this.groupsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
