import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ActiveUserId } from '@src/shared/decorators/ActiveUserId';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import type { QueryOptions } from '@interfaces/QueryOptions';
import { FavoritesService } from './favorites.service';

@Controller('posts/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('me')
  findFavorites(
    @ActiveUserId() userId: string,
    @Query() { limit, page, orderBy }: QueryOptions,
  ) {
    return this.favoritesService.findFavorites(userId, {
      limit,
      page,
      orderBy,
    });
  }

  @Post()
  create(
    @ActiveUserId() userId: string,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return this.favoritesService.create(userId, createFavoriteDto);
  }
}
