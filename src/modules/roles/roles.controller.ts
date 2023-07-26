import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(@Query() { limit, page, orderBy }: QueryOptions) {
    return this.rolesService.findAll({ limit, page, orderBy });
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }
}
