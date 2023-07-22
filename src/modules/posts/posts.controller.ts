import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query('limit') limit: number, @Query('page') page: number) {
    return this.postsService.findAll(Number(limit), Number(page));
  }

  @Get(':categoryId')
  findAllByCategoryId(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.postsService.findAllByCategoryId(
      categoryId,
      Number(limit),
      Number(page),
    );
  }

  @Post()
  create(
    @ActiveUserId() authorId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(authorId, createPostDto);
  }

  @Put(':postId')
  update(
    @ActiveUserId() authorId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(authorId, postId, updatePostDto);
  }

  @Delete(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @ActiveUserId() authorId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.postsService.delete(authorId, postId);
  }
}
