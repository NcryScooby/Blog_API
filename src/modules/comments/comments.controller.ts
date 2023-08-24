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
import { ActiveUserRoleId } from 'src/shared/decorators/ActiveUserRoleId';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
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
