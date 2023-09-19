import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CreateLikeDto } from '@modules/likes/dto/create-like.dto';
import type { QueryOptions } from '@interfaces/QueryOptions';
import { LikesService } from '@modules/likes/likes.service';
import { ActiveUserId } from '@decorators/ActiveUserId';

@Controller('posts/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get(':postId')
  findLikeByPostId(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() { limit, page, orderBy }: QueryOptions,
  ) {
    return this.likesService.findLikeByPostId(postId, {
      limit,
      page,
      orderBy,
    });
  }

  @Post()
  create(
    @ActiveUserId() authorId: string,
    @Body() createLikeDto: CreateLikeDto,
  ) {
    return this.likesService.create(authorId, createLikeDto);
  }
}
