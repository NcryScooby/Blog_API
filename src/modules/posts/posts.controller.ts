import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':categoryId')
  findAllByCategoryId(@Param('categoryId', ParseUUIDPipe) categoryId: string) {
    return this.postsService.findAllByCategoryId(categoryId);
  }
}
