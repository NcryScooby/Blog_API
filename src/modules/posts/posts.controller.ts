import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query('limit') limit: number, @Query('page') page: number) {
    return this.postsService.findAll(Number(limit), Number(page));
  }

  @Get(':categoryId')
  findAllByCategoryId(@Param('categoryId', ParseUUIDPipe) categoryId: string) {
    return this.postsService.findAllByCategoryId(categoryId);
  }

  @Post()
  create(
    @ActiveUserId() authorId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(authorId, createPostDto);
  }
}
