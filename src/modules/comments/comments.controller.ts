import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';

@Controller('posts/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':postId')
  findLikeByPostId(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() { limit, page, orderBy }: QueryOptions,
  ) {
    return this.commentsService.findCommentByPostId(postId, {
      limit,
      page,
      orderBy,
    });
  }

  @Post()
  create(
    @ActiveUserId() authorId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(authorId, createCommentDto);
  }
}
