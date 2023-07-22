import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';

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

  @Post()
  create(
    @ActiveUserId() authorId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(authorId, createPostDto);
  }
}
