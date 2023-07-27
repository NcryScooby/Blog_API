import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @IsPublic()
  findAll(@Query() { limit, page, orderBy }: QueryOptions) {
    return this.rolesService.findAll({ limit, page, orderBy });
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Delete(':roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('roleId', ParseUUIDPipe) postId: string) {
    return this.rolesService.delete(postId);
  }
}
