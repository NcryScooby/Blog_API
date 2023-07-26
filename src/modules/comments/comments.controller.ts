import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';

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

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @ActiveUserId() authorId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this.commentsService.delete(authorId, commentId);
  }
}
