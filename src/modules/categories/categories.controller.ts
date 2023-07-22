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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@Query('limit') limit: number, @Query('page') page: number) {
    return this.categoriesService.findAll(Number(limit), Number(page));
  }

  @Get(':categoryId')
  findById(@Param('categoryId', ParseUUIDPipe) categoryId: string) {
    return this.categoriesService.findById(categoryId);
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':categoryId')
  update(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(categoryId, updateCategoryDto);
  }

  @Delete(':categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('categoryId', ParseUUIDPipe) categoryId: string) {
    return this.categoriesService.delete(categoryId);
  }
}
