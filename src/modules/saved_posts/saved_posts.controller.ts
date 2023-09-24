import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ActiveUserId } from '@src/shared/decorators/ActiveUserId';
import { CreateSavedPostDto } from './dto/create-saved-posts.dto';
import type { QueryOptions } from '@interfaces/QueryOptions';
import { SavedPostsService } from './saved_posts.service';

@Controller('posts/saved-posts')
export class SavedPostsController {
  constructor(private readonly savedPostsService: SavedPostsService) {}

  @Get('me')
  findSavedPosts(
    @ActiveUserId() userId: string,
    @Query() { limit, page, orderBy }: QueryOptions,
  ) {
    return this.savedPostsService.findSavedPosts(userId, {
      limit,
      page,
      orderBy,
    });
  }

  @Post()
  create(
    @ActiveUserId() userId: string,
    @Body() createSavedPostDto: CreateSavedPostDto,
  ) {
    return this.savedPostsService.create(userId, createSavedPostDto);
  }
}
