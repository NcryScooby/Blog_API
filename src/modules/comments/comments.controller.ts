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
  Put,
} from '@nestjs/common';
import { CreateCommentDto } from '@modules/comments/dto/create-comment.dto';
import { UpdateCommentDto } from '@modules/comments/dto/update-comment.dto';
import { CommentsService } from '@modules/comments/comments.service';
import { ActiveUserRoleId } from '@decorators/ActiveUserRoleId';
import type { QueryOptions } from '@interfaces/QueryOptions';
import { ActiveUserId } from '@decorators/ActiveUserId';

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

  @Put(':commentId')
  update(
    @ActiveUserId() authorId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(authorId, commentId, updateCommentDto);
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @ActiveUserRoleId() roleId: string,
    @ActiveUserId() authorId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this.commentsService.delete(roleId, authorId, commentId);
  }
}
