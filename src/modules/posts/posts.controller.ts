import {
  BadRequestException,
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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ActiveUserRoleId } from 'src/shared/decorators/ActiveUserRoleId';
import { MulterUploadImage } from 'src/shared/utils/MulterUploadImage';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(
    @Query('title') title: string,
    @Query() { limit, page, orderBy }: QueryOptions,
  ) {
    return this.postsService.findAll(title, { limit, page, orderBy });
  }

  @Get('categories/:categoryId')
  findAllByCategoryId(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Query('title') title: string,
    @Query() { limit, page, orderBy }: QueryOptions,
  ) {
    return this.postsService.findAllByCategoryId(categoryId, title, {
      limit,
      page,
      orderBy,
    });
  }

  @Get('authors/:authorId')
  findAllByAuthorId(
    @Param('authorId', ParseUUIDPipe) authorId: string,
    @Query('title') title: string,
    @Query() { limit, page, orderBy }: QueryOptions,
  ) {
    return this.postsService.findAllByAuthorId(authorId, title, {
      limit,
      page,
      orderBy,
    });
  }

  @Get(':postId')
  findById(@Param('postId', ParseUUIDPipe) postId: string) {
    return this.postsService.findById(postId);
  }

  @Post()
  @UseInterceptors(MulterUploadImage('posts'))
  create(
    @ActiveUserId() authorId: string,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const image = file?.filename;

    if (!image) throw new BadRequestException('Image is required');

    return this.postsService.create(authorId, {
      ...createPostDto,
      image,
    });
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
    @ActiveUserRoleId() roleId: string,
    @ActiveUserId() authorId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.postsService.delete(roleId, authorId, postId);
  }
}
