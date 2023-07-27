import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
  Query,
} from '@nestjs/common';
import { ActiveUserRoleId } from 'src/shared/decorators/ActiveUserRoleId';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(
    @Query('name') name: string,
    @Query() { limit, page, orderBy }: QueryOptions,
  ) {
    return this.categoriesService.findAll(name, { limit, page, orderBy });
  }

  @Get(':categoryId')
  findById(@Param('categoryId', ParseUUIDPipe) categoryId: string) {
    return this.categoriesService.findById(categoryId);
  }

  @Post()
  create(
    @ActiveUserRoleId() roleId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(createCategoryDto, roleId);
  }

  @Put(':categoryId')
  update(
    @ActiveUserRoleId() roleId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(categoryId, updateCategoryDto, roleId);
  }

  @Delete(':categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @ActiveUserRoleId() roleId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    return this.categoriesService.delete(categoryId, roleId);
  }
}
